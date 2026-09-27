(() => {
  const api = window.BloodConnectApi;
  if (!api) return;
  const page = location.pathname.split("/").pop().replace(".html", "");
  const endpoints = { inventory: "/inventory", donors: "/donors", hospitals: "/hospitals", "blood-requests": "/requests", transactions: "/transactions" };
  const messages = e => alert(e.message || "Could not connect to the backend");
  const vals = modal => [...modal.querySelectorAll("input,select,textarea")].map(x => x.value.trim());
  const td = value => { const cell=document.createElement("td"); cell.textContent=value ?? "—"; return cell; };
  const draw = (records, kind) => {
    const tbody=document.querySelector("table tbody"); if(!tbody)return;
    const count=document.querySelector(".record-count"); if(count)count.textContent=`${records.length} record${records.length===1?"":"s"}`;
    tbody.replaceChildren();
    records.forEach(x => {
      let values;
      if(kind==="inventory") values=[x.id,x.bloodGroup,x.component,x.donorId||"—",x.collectionDate,x.expiryDate,x.quantity,x.status==="Used"?"Issued":x.status,""];
      if(kind==="donors") values=[x.id,x.name,x.bloodGroup,x.age,x.gender,x.phone,x.lastDonationDate||"—",x.status,""];
      if(kind==="hospitals") values=[x.id,x.name,x.city,x.contactPerson,x.phone,"—",x.status,""];
      if(kind==="blood-requests") values=[x.id,x.hospitalName,x.bloodGroup,x.component,x.quantity,x.requiredDate,x.priority,x.status,""];
      if(kind==="transactions") values=[x.id,(x.transactionDate||"").replace("T"," "),x.type,x.bloodGroup,x.component,x.quantity,x.reference||"—",x.status,""];
      const row=document.createElement("tr"); values.forEach(v=>row.append(td(v))); tbody.append(row);
    });
  };
  const refresh = async () => { if(endpoints[page]) try {draw(await api.get(endpoints[page]),page);} catch(e){messages(e);} };
  const modal = () => document.getElementById(({inventory:"modal",donors:"donorModal",hospitals:"hospitalModal","blood-requests":"requestModal"})[page]);
  const value = (a,i) => a[i] || "";
  const bindSave = (name, endpoint, mapper, close) => { window[name]=async()=>{try{const form=modal();if(!form)throw new Error("Could not find the entry form on this page.");const data=mapper(vals(form));await api.post(endpoint,data);close?.();await refresh();}catch(e){messages(e);}}; };
  if(page==="inventory") bindSave("addBloodUnit","/inventory",a=>({donorId:value(a,0),bloodGroup:value(a,1),component:value(a,2),quantity:Number(value(a,3)),collectionDate:value(a,4)||null,expiryDate:value(a,5)||null,storageLocation:value(a,6),status:"Available"}),()=>window.closeModal?.());
  if(page==="donors") bindSave("registerDonor","/donors",a=>({name:value(a,0),bloodGroup:value(a,1),age:Number(value(a,2)),gender:value(a,3),phone:value(a,4),lastDonationDate:value(a,5)||null,status:"Active"}),()=>window.closeDonorModal?.());
  if(page==="hospitals") bindSave("registerHospital","/hospitals",a=>({name:value(a,0),registrationNumber:value(a,1),city:value(a,2),contactPerson:value(a,3),phone:value(a,4),email:value(a,5),address:value(a,6),status:"Active"}),()=>window.closeHospitalModal?.());
  if(page==="blood-requests") bindSave("submitRequest","/requests",a=>({hospitalName:value(a,0),bloodGroup:value(a,1),component:value(a,2),quantity:Number(value(a,3)),requiredDate:value(a,4)||null,priority:value(a,5)||"Medium",notes:value(a,6),status:"Pending"}),()=>window.closeRequestModal?.());
  if(page==="settings") {
    const inputs=[...document.querySelectorAll(".settings-grid .settings-card input:not([type=checkbox]):not([type=password])")];
    const checks=[...document.querySelectorAll(".settings-grid .settings-card input[type=checkbox]")];
    const selects=[...document.querySelectorAll(".settings-grid .settings-card select")];
    window.saveSettings=async()=>{try{const s=await api.get("/settings");[s.firstName,s.lastName,s.email,s.phone,s.bloodBankName,s.location,s.contactNumber,s.bloodBankCode]=inputs.slice(0,8).map(x=>x.value);[s.lowStockAlerts,s.expiryAlerts,s.requestAlerts]=checks.map(x=>x.checked);if(selects[0])s.defaultComponent=selects[0].value;if(selects[1])s.defaultRequestStatus=selects[1].value;if(selects[2])s.recordsPerPage=Number(selects[2].value);await api.put("/settings",s);alert("Settings saved.");}catch(e){messages(e);}};
    (async()=>{try{const s=await api.get("/settings");[s.firstName,s.lastName,s.email,s.phone,s.bloodBankName,s.location,s.contactNumber,s.bloodBankCode].forEach((v,i)=>{if(inputs[i])inputs[i].value=v||"";});[s.lowStockAlerts,s.expiryAlerts,s.requestAlerts].forEach((v,i)=>{if(checks[i])checks[i].checked=!!v;});[s.defaultComponent,s.defaultRequestStatus,s.recordsPerPage].forEach((v,i)=>{if(selects[i]&&v!=null)selects[i].value=String(v);});}catch(e){messages(e);}})();
  }
  if(page==="reports") {
    const updateStockChart=async()=>{try{const report=await api.get("/reports/summary");const chart=window.Chart?.getChart("bloodGroupChart");if(chart){chart.data.labels=Object.keys(report.stockByBloodGroup);chart.data.datasets[0].data=Object.values(report.stockByBloodGroup);chart.update();}}catch(e){messages(e);}};
    updateStockChart();
    window.updateReport=updateStockChart;
  }
  refresh();
})();
