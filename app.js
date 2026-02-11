const form = document.getElementById("payrollForm");
const tbody = document.getElementById("payrollTbody");
const msg = document.getElementById("msg");

const sumEmployees = document.getElementById("sumEmployees");
const sumGross = document.getElementById("sumGross");
const sumDed = document.getElementById("sumDed");
const sumNet = document.getElementById("sumNet");

const clearAllBtn = document.getElementById("clearAllBtn");
const resetBtn = document.getElementById("resetBtn");

let payrollData = [];
let editIndex = -1;

function peso(val){
  return "₱" + val.toFixed(2);
}

function computePayroll(hours, rate, taxPercent, otherDed){
  let gross = hours * rate;
  let tax = gross * (taxPercent/100);
  let totalDed = tax + otherDed;
  let net = gross - totalDed;

  return {gross, tax, totalDed, net};
}

function renderTable(){
  tbody.innerHTML = "";

  payrollData.forEach((p, index)=>{
    let row = document.createElement("tr");

    row.innerHTML = `
      <td>${index+1}</td>
      <td>${p.name}</td>
      <td>${p.hours}</td>
      <td>${peso(p.rate)}</td>
      <td>${peso(p.gross)}</td>
      <td>${peso(p.tax)}</td>
      <td>${peso(p.other)}</td>
      <td>${peso(p.net)}</td>
      <td>
        <button onclick="editRecord(${index})">Edit</button>
        <button onclick="deleteRecord(${index})">Delete</button>
      </td>
    `;

    tbody.appendChild(row);
  });

  updateSummary();
}

function updateSummary(){
  let totalGross=0;
  let totalDed=0;
  let totalNet=0;

  payrollData.forEach(p=>{
    totalGross+=p.gross;
    totalDed+=p.tax+p.other;
    totalNet+=p.net;
  });

  sumEmployees.textContent = payrollData.length;
  sumGross.textContent = peso(totalGross);
  sumDed.textContent = peso(totalDed);
  sumNet.textContent = peso(totalNet);
}

form.addEventListener("submit", function(e){
  e.preventDefault();

  let name = document.getElementById("empName").value;
  let hours = parseFloat(document.getElementById("hours").value);
  let rate = parseFloat(document.getElementById("rate").value);
  let taxPercent = parseFloat(document.getElementById("tax").value);
  let other = parseFloat(document.getElementById("otherDed").value);

  let result = computePayroll(hours, rate, taxPercent, other);

  let record = {
    name,
    hours,
    rate,
    tax: result.tax,
    other,
    gross: result.gross,
    net: result.net
  };

  if(editIndex === -1){
    payrollData.push(record);
    msg.textContent="Payroll added!";
  }else{
    payrollData[editIndex]=record;
    editIndex=-1;
    msg.textContent="Payroll updated!";
  }

  form.reset();
  renderTable();
});

function editRecord(index){
  let p = payrollData[index];

  document.getElementById("empName").value = p.name;
  document.getElementById("hours").value = p.hours;
  document.getElementById("rate").value = p.rate;
  document.getElementById("tax").value = ((p.tax/p.gross)*100).toFixed(2);
  document.getElementById("otherDed").value = p.other;

  editIndex = index;
}

function deleteRecord(index){
  payrollData.splice(index,1);
  renderTable();
}

clearAllBtn.addEventListener("click", function(){
  payrollData=[];
  renderTable();
});

resetBtn.addEventListener("click", function(){
  form.reset();
  editIndex=-1;
});
