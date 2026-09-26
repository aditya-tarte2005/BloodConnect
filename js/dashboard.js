function toggleSidebar(){document.querySelector('.sidebar').classList.toggle('open')}

const apiConnectionStatus = document.getElementById('apiConnectionStatus');
if (apiConnectionStatus && window.BloodConnectApi) {
  window.BloodConnectApi.health()
    .then(({status, service}) => {
      apiConnectionStatus.textContent = `${service} connected (${status})`;
      apiConnectionStatus.classList.add('connected');
      apiConnectionStatus.classList.remove('disconnected');
    })
    .catch(() => {
      apiConnectionStatus.textContent = 'Backend unavailable. Start the Spring Boot app on port 8080.';
      apiConnectionStatus.classList.add('disconnected');
      apiConnectionStatus.classList.remove('connected');
    });
}

const stockCanvas=document.getElementById('stockChart');
if(stockCanvas){
  new Chart(stockCanvas,{type:'bar',data:{labels:['A+','A-','B+','B-','O+','O-','AB+','AB-'],datasets:[{label:'Units',data:[120,60,90,40,140,20,70,30],borderRadius:5,backgroundColor:'#df3a42'}]},options:{responsive:true,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true,max:200,ticks:{stepSize:50}},x:{grid:{display:false}}}}});
}
const componentCanvas=document.getElementById('componentChart');
if(componentCanvas){
  new Chart(componentCanvas,{type:'doughnut',data:{labels:['Whole Blood','RBC','Plasma','Platelets'],datasets:[{data:[45,25,20,10],backgroundColor:['#df323a','#3478dc','#38a866','#f3ae25'],borderWidth:0}]},options:{cutout:'68%',plugins:{legend:{display:false}}}});
}

function filterTable(){
  const search=(document.getElementById('searchInput')?.value||'').toLowerCase();
  const group=document.getElementById('groupFilter')?.value||'';
  const status=document.getElementById('statusFilter')?.value||'';
  document.querySelectorAll('#inventoryTable tbody tr').forEach(row=>{
    const text=row.innerText.toLowerCase();
    const rowGroup=row.cells[1]?.innerText.trim();
    const rowStatus=row.cells[7]?.innerText.trim();
    row.style.display=(!search||text.includes(search))&&(!group||rowGroup===group)&&(!status||rowStatus===status)?'':'none';
  });
}
function openModal(){document.getElementById('modal')?.classList.add('show')}
function closeModal(){document.getElementById('modal')?.classList.remove('show')}

// ================= NOTIFICATION MENU =================

function toggleNotificationMenu() {

    const menu = document.getElementById("notificationMenu");

    if (menu) {
        menu.classList.toggle("show");
    }

}


// Close notification menu when clicking outside

document.addEventListener("click", function(event) {

    const notificationArea =
        document.querySelector(".notification-area");

    const menu =
        document.getElementById("notificationMenu");

    if (
        menu &&
        notificationArea &&
        !notificationArea.contains(event.target)
    ) {

        menu.classList.remove("show");

    }

});
// ================= DASHBOARD SEARCH =================

function searchDashboard() {

    const searchInput =
        document.getElementById("dashboardSearch");

    if (!searchInput) {
        return;
    }

    const searchText =
        searchInput.value.toLowerCase().trim();


    // Search these dashboard sections
    const searchableItems =
        document.querySelectorAll(
            ".stat, .table-card tbody tr, .alert, .quick-actions .action"
        );


    searchableItems.forEach(function(item) {

        const itemText =
            item.innerText.toLowerCase();

        if (
            !searchText ||
            itemText.includes(searchText)
        ) {

            item.style.display = "";

        } else {

            item.style.display = "none";

        }

    });

}
