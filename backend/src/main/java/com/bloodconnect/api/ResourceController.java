package com.bloodconnect.api;

import com.bloodconnect.model.*;
import com.bloodconnect.repository.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api")
public class ResourceController {
    private final DonorRepository donors; private final HospitalRepository hospitals;
    private final InventoryRepository inventory; private final BloodRequestRepository requests;
    private final StockTransactionRepository transactions; private final AppSettingsRepository settings;
    public ResourceController(DonorRepository donors, HospitalRepository hospitals, InventoryRepository inventory,
      BloodRequestRepository requests, StockTransactionRepository transactions, AppSettingsRepository settings) {
        this.donors=donors; this.hospitals=hospitals; this.inventory=inventory; this.requests=requests; this.transactions=transactions; this.settings=settings;
    }
    private String id(){ return UUID.randomUUID().toString(); }
    @GetMapping("/donors") public List<BloodDonor> donors(){return donors.findAll();}
    @PostMapping("/donors") public BloodDonor donor(@Valid @RequestBody BloodDonor x){ if(x.id==null)x.id=id(); return donors.save(x); }
    @GetMapping("/donors/{id}") public BloodDonor donor(@PathVariable String id){return donors.findById(id).orElseThrow(()->missing("Donor"));}
    @PutMapping("/donors/{id}") public BloodDonor updateDonor(@PathVariable String id,@Valid @RequestBody BloodDonor x){donor(id);x.id=id;return donors.save(x);}
    @DeleteMapping("/donors/{id}") public void deleteDonor(@PathVariable String id){donors.deleteById(id);}
    @GetMapping("/hospitals") public List<Hospital> hospitals(){return hospitals.findAll();}
    @PostMapping("/hospitals") public Hospital hospital(@Valid @RequestBody Hospital x){if(x.id==null)x.id=id();return hospitals.save(x);}
    @GetMapping("/hospitals/{id}") public Hospital hospital(@PathVariable String id){return hospitals.findById(id).orElseThrow(()->missing("Hospital"));}
    @PutMapping("/hospitals/{id}") public Hospital updateHospital(@PathVariable String id,@Valid @RequestBody Hospital x){hospital(id);x.id=id;return hospitals.save(x);}
    @DeleteMapping("/hospitals/{id}") public void deleteHospital(@PathVariable String id){hospitals.deleteById(id);}
    @GetMapping("/inventory") public List<InventoryUnit> inventory(){return inventory.findAll();}
    @PostMapping("/inventory") @Transactional public InventoryUnit addInventory(@Valid @RequestBody InventoryUnit x){if(x.id==null)x.id=id(); if(x.expiryDate!=null&&x.expiryDate.isBefore(LocalDate.now()))x.status="Expired"; var saved=inventory.save(x);var tx=new StockTransaction();tx.id=id();tx.type="Donation";tx.bloodGroup=x.bloodGroup;tx.component=x.component;tx.quantity=x.quantity;tx.reference=saved.id;transactions.save(tx);return saved;}
    @GetMapping("/inventory/{id}") public InventoryUnit unit(@PathVariable String id){return inventory.findById(id).orElseThrow(()->missing("Inventory unit"));}
    @PutMapping("/inventory/{id}") public InventoryUnit updateUnit(@PathVariable String id,@Valid @RequestBody InventoryUnit x){unit(id);x.id=id;return inventory.save(x);}
    @DeleteMapping("/inventory/{id}") public void deleteUnit(@PathVariable String id){inventory.deleteById(id);}
    @GetMapping("/requests") public List<BloodRequest> requests(){return requests.findAll();}
    @PostMapping("/requests") public BloodRequest createRequest(@Valid @RequestBody BloodRequest x){if(x.id==null)x.id=id(); if(x.hospitalId!=null&&hospitals.existsById(x.hospitalId))x.hospitalName=hospitals.findById(x.hospitalId).orElseThrow().name;return requests.save(x);}
    @GetMapping("/requests/{id}") public BloodRequest request(@PathVariable String id){return requests.findById(id).orElseThrow(()->missing("Request"));}
    @PutMapping("/requests/{id}") @Transactional public BloodRequest updateRequest(@PathVariable String id,@Valid @RequestBody BloodRequest x){
      var old=request(id); x.id=id;
      if("Fulfilled".equalsIgnoreCase(x.status)&&!"Fulfilled".equalsIgnoreCase(old.status)){
        int remaining=x.quantity;
        for(var unit:inventory.findByBloodGroupAndComponentAndStatusOrderByExpiryDateAsc(x.bloodGroup,x.component,"Available")){
          if(unit.expiryDate!=null&&unit.expiryDate.isBefore(LocalDate.now())){unit.status="Expired";inventory.save(unit);continue;}
          int used=Math.min(unit.quantity,remaining);unit.quantity-=used;remaining-=used;if(unit.quantity==0)unit.status="Issued";inventory.save(unit);if(remaining==0)break;
        }
        if(remaining>0)throw new ResponseStatusException(HttpStatus.CONFLICT,"Insufficient available stock to fulfil request");
        var tx=new StockTransaction();tx.id=id();tx.type="Issue";tx.bloodGroup=x.bloodGroup;tx.component=x.component;tx.quantity=x.quantity;tx.reference=id;transactions.save(tx);
      }
      return requests.save(x);
    }
    @DeleteMapping("/requests/{id}") public void deleteRequest(@PathVariable String id){requests.deleteById(id);}
    @GetMapping("/transactions") public List<StockTransaction> transactions(){return transactions.findAll();}
    @GetMapping("/notifications") public List<Map<String,String>> notifications(){
      var result=new ArrayList<Map<String,String>>();var preferences=settings.findById("default").orElseGet(AppSettings::new);var today=LocalDate.now();
      if(preferences.lowStockAlerts)for(var unit:inventory.findAll())if("Available".equalsIgnoreCase(unit.status)&&unit.quantity<=5)result.add(Map.of("id","low-"+unit.id,"type","low-stock","title","Low stock: "+unit.bloodGroup,"message",unit.quantity+" "+unit.component+" unit(s) available.","time","Current stock"));
      if(preferences.expiryAlerts)for(var unit:inventory.findAll())if("Available".equalsIgnoreCase(unit.status)&&unit.expiryDate!=null&&!unit.expiryDate.isBefore(today)&&!unit.expiryDate.isAfter(today.plusDays(3)))result.add(Map.of("id","expiry-"+unit.id,"type","expiry","title","Expiry alert: "+unit.bloodGroup,"message",unit.quantity+" "+unit.component+" unit(s) expire on "+unit.expiryDate+".","time","Within 3 days"));
      if(preferences.requestAlerts)for(var request:requests.findAll())if("Pending".equalsIgnoreCase(request.status))result.add(Map.of("id","request-"+request.id,"type","request","title","Pending blood request","message",request.hospitalName+" requested "+request.quantity+" "+request.bloodGroup+" "+request.component+" unit(s).","time",request.createdAt==null?"Pending":request.createdAt.toString()));
      return result;
    }
    @GetMapping("/settings") public AppSettings getSettings(){return settings.findById("default").orElseGet(()->settings.save(new AppSettings()));}
    @PutMapping("/settings") public AppSettings updateSettings(@RequestBody AppSettings x){x.id="default";return settings.save(x);}
    @GetMapping("/dashboard") public Map<String,Object> dashboard(){var all=inventory.findAll();long total=all.stream().mapToLong(x->x.quantity).sum();long available=all.stream().filter(x->"Available".equalsIgnoreCase(x.status)).mapToLong(x->x.quantity).sum();long expired=all.stream().filter(x->"Expired".equalsIgnoreCase(x.status)).mapToLong(x->x.quantity).sum();long reserved=all.stream().filter(x->"Reserved".equalsIgnoreCase(x.status)).mapToLong(x->x.quantity).sum();long low=all.stream().filter(x->"Available".equalsIgnoreCase(x.status)&&x.quantity<=5).count();return Map.of("donors",donors.count(),"hospitals",hospitals.count(),"inventoryUnits",all.size(),"totalUnits",total,"availableUnits",available,"reservedUnits",reserved,"expiredUnits",expired,"lowStockUnits",low,"pendingRequests",requests.findAll().stream().filter(x->"Pending".equalsIgnoreCase(x.status)).count());}
    @GetMapping("/reports/summary") public Map<String,Object> report(){var grouped=new TreeMap<String,Long>();for(var u:inventory.findAll())if("Available".equalsIgnoreCase(u.status))grouped.merge(u.bloodGroup,(long)u.quantity,Long::sum);return Map.of("stockByBloodGroup",grouped,"transactions",transactions.count(),"requests",requests.count());}
    private ResponseStatusException missing(String type){return new ResponseStatusException(HttpStatus.NOT_FOUND,type+" not found");}
}
