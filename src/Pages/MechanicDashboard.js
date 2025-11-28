import React, { useEffect, useState } from "react";
import "../Style.css";
import pdfMake from "pdfmake/build/pdfmake.min";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.vfs;


function MechanicDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [jobOrders, setJobOrders] = useState([]);
  const totalSales = jobOrders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);

  // JOB ORDER STATES
  const [showJobOrderModal, setShowJobOrderModal] = useState(false);
  const [editJobIndex, setEditJobIndex] = useState(null); // Track which job is being edited

  // form fields
  const [jobOrderNo, setJobOrderNo] = useState(1);
  const [clientName, setClientName] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [customerType, setCustomerType] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [dateIn, setDateIn] = useState("");
  const [dateRelease, setDateRelease] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [status, setStatus] = useState("Pending");
  const [address, setAddress] = useState("");
  const [services, setServices] = useState([{ description: "", qty: "1", unit: "", price: "" }]);
  const [parts, setParts] = useState([{ description: "", qty: "1", price: "" }]);

  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  // compute totals
  const calculateTotals = () => {
    const serviceTotal = services.reduce((sum, s) => {
      const q = parseFloat(s.qty) || 0;
      const p = parseFloat(s.price) || 0;
      return sum + q * p;
    }, 0);

    const partsTotal = parts.reduce((sum, p) => {
      const q = parseFloat(p.qty) || 0;
      const pr = parseFloat(p.price) || 0;
      return sum + q * pr;
    }, 0);

    const total = serviceTotal + partsTotal;

    let discountRate = 0;
    if (customerType === "LGU") discountRate = 0.6;
    const discountAmount = total * discountRate;
    const grand = total - discountAmount;

    setSubtotal(total);
    setDiscount(discountAmount);
    setGrandTotal(grand);
  };

  useEffect(() => {
    calculateTotals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [services, parts, customerType]);

  // add / update / delete service rows
  const addServiceRow = () => {
    setServices((prev) => [...prev, { description: "", qty: "1", unit: "", price: "" }]);
  };
  const updateService = (index, field, value) => {
    setServices((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };
  const deleteService = (index) => {
    setServices((prev) => {
      if (prev.length <= 1) return prev;
      const copy = prev.filter((_, i) => i !== index);
      return copy;
    });
  };

  // parts row handlers
  const addPartRow = () => {
    setParts((prev) => [...prev, { description: "", qty: "1", price: "" }]);
  };
  const updatePart = (index, field, value) => {
    setParts((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };
  const deletePart = (index) => {
    setParts((prev) => {
      if (prev.length <= 1) return prev;
      const copy = prev.filter((_, i) => i !== index);
      return copy;
    });
  };

  const isJobFormValid = () => {
    if (!clientName.trim() || !customerType || !dateIn || !assignedTo.trim()) return false;

    for (const s of services) {
  if (!s.description?.trim() ||
      !s.unit?.trim() ||
      !s.qty ||
      s.price === "" ||
      isNaN(parseFloat(s.price))) return false;
}

for (const p of parts) {
  if (!p.description?.trim() ||
      !p.qty ||
      p.price === "" ||
      isNaN(parseFloat(p.price))) return false;
}

    return true;
  };

  // save job order
  const saveJobOrder = () => {
    if (!isJobFormValid()) return;

    const orderData = {
      joNumber: editJobIndex !== null ? jobOrders[editJobIndex].joNumber : jobOrderNo,
      client: clientName,
      address,
      vehicleModel,
      contactNumber,
      plate: plateNumber,
      total: grandTotal,
      status,
      assignedTo,
      dateIn,
      dateRelease,
      services,
      parts,
      subtotal,
      discount,
      createdAt: new Date().toISOString(),
    };

    let updatedJobs = [...jobOrders];
    if (editJobIndex !== null) {
      // update existing
      updatedJobs[editJobIndex] = orderData;
    } else {
      // create new
      updatedJobs.push(orderData);
    }

    // reindex job numbers
    updatedJobs = updatedJobs.map((o, idx) => ({ ...o, joNumber: idx + 1 }));

    setJobOrders(updatedJobs);
    setJobOrderNo(updatedJobs.length + 1);

    resetJobForm();
    setShowJobOrderModal(false);
    setEditJobIndex(null);
  };

  const deleteJobOrder = (index) => {
    const updated = jobOrders.filter((_, i) => i !== index).map((o, idx) => ({ ...o, joNumber: idx + 1 }));
    setJobOrders(updated);
    setJobOrderNo(updated.length + 1);
  };

  const resetJobForm = () => {
  setClientName("");
  setVehicleModel("");
  setPlateNumber("");
  setCustomerType("");
  setContactNumber("");
  setDateIn("");
  setDateRelease("");
  setAssignedTo("");
  setStatus("Pending");
  setAddress(""); // add this
  setServices([{ description: "", unit:"", qty: "1", price: "" }]);
  setParts([{ description: "", qty: "1", price: "" }]);
  setSubtotal(0);
  setDiscount(0);
  setGrandTotal(0);
};


  // handle edit
  const handleEditJob = (index) => {
    const job = jobOrders[index];
    setClientName(job.client);
    setVehicleModel(job.vehicleModel);
    setPlateNumber(job.plate);
    setCustomerType(job.customerType || "Private");
    setAddress(job.address || "");           // add this
    setContactNumber(job.contactNumber || "");
    setDateIn(job.dateIn);
    setDateRelease(job.dateRelease);
    setAssignedTo(job.assignedTo);
    setStatus(job.status);
    setServices(job.services.length > 0 ? job.services : [{ description: "", unit:"", qty: "1", price: "" }]);
    setParts(job.parts.length > 0 ? job.parts : [{ description: "", qty: "1", price: "" }]);
    setSubtotal(job.subtotal);
    setDiscount(job.discount);
    setGrandTotal(job.total);
    setEditJobIndex(index);
    setShowJobOrderModal(true);
  };

  // PRODUCT STATES
  const [newProduct, setNewProduct] = useState({ name: "", quantity: "", price: "", srp: "" });
  const [editIndex, setEditIndex] = useState(null);

  const logoSrc = process.env.PUBLIC_URL + "/HeaderLogo.png";

  const isFormValid = () => newProduct.name.trim() !== "" && newProduct.quantity !== "" && newProduct.price !== "" && newProduct.srp !== "";

  
  const exportJobOrderPDF = async () => {
  // Load logo (make sure path is correct)
  const logoBase64 = await loadBase64Image(process.env.PUBLIC_URL + "/AutronicasLogo.png");

  const jobData = {
    joNumber: editJobIndex !== null ? jobOrders[editJobIndex].joNumber : jobOrderNo,
    client: clientName,
    address,
    vehicleModel,
    plateNumber,
    dateIn,
    dateRelease,
    customerType,
    assignedTo,
    contactNumber,
    subtotal,
    discount,
    grandTotal,
    services,
    parts
  };

  const serviceRows = jobData.services.map(s => ([
    { text: s.description, fontSize: 10 },
    { text: s.qty, alignment: "center", fontSize: 10 },
    { text: s.unit, alignment: "center", fontSize: 10 },
    { text: Number(s.price).toFixed(2), alignment: "right", fontSize: 10 },
    { text: (parseFloat(s.qty) * parseFloat(s.price)).toFixed(2), alignment: "right", fontSize: 10 }
  ]));

  const partsRows = jobData.parts.map(p => ([
    { text: p.description, fontSize: 10 },
    { text: p.qty, alignment: "center", fontSize: 10 },
    { text: Number(p.price).toFixed(2), alignment: "right", fontSize: 10 },
    { text: (parseFloat(p.qty) * parseFloat(p.price)).toFixed(2), alignment: "right", fontSize: 10 }
  ]));

  const docDefinition = {
    pageSize: "LETTER",
    pageMargins: [40, 25, 40, 40],

    content: [
      // 🔥 Insert LOGO as image
      {
        image: logoBase64,
        width: 180,     // adjust to match your layout
        alignment: "center",
        margin: [0, 0, 0, 10]
      },

      {
        text: "AUTO SERVICE AND SPARE PARTS CORP.",
        style: "header",
        alignment: "center"
      },
      {
        text: "MAHARLIKA HIGHWAY SITIO BAGONG TULAY BRGY. BUKAL PAGBILAO QUEZON",
        style: "subheader",
        alignment: "center",
        margin: [0, -2, 0, 5]
      },
      {
        text: "SMART: 09989990252   GLOBE: 09171874571",
        alignment: "center",
        fontSize: 9,
        margin: [0, 0, 0, 12]
      },

      {
        columns: [
          { text: "REF NO.: " + jobData.joNumber, bold: true, fontSize: 11 },
          { text: "JOB ORDER NO.: " + jobData.joNumber, bold: true, fontSize: 11, alignment: "right" }
        ],
        margin: [0, 5, 0, 10]
      },

      {
        table: {
          widths: ["*", "*"],
          body: [
            [
              { text: `Client Name: ${jobData.client}`, fontSize: 10 },
              { text: `Address: ${jobData.address}`, fontSize: 10 }
            ],
            [
              { text: `Model: ${jobData.vehicleModel}`, fontSize: 10 },
              { text: `Plate No: ${jobData.plateNumber}`, fontSize: 10 }
            ],
            [
              { text: `Date In: ${jobData.dateIn}`, fontSize: 10 },
              { text: `Date Out: ${jobData.dateRelease}`, fontSize: 10 }
            ],
            [
              { text: `Customer Type: ${jobData.customerType}`, fontSize: 10 },
              { text: `Contact No: ${jobData.contactNumber}`, fontSize: 10 }
            ]
          ]
        },
        layout: "noBorders",
        margin: [0, 0, 0, 15]
      },

      { text: "SERVICES", style: "sectitle" },

      {
        table: {
          widths: ["*", 40, 40, 60, 60],
          headerRows: 1,
          body: [
            [
              { text: "JOB/ITEM DESCRIPTION", bold: true, fontSize: 10 },
              { text: "QNT", bold: true, alignment: "center", fontSize: 10 },
              { text: "UNIT", bold: true, alignment: "center", fontSize: 10 },
              { text: "AMOUNT", bold: true, alignment: "right", fontSize: 10 },
              { text: "TOTAL AMOUNT", bold: true, alignment: "right", fontSize: 10 }
            ],
            ...serviceRows
          ]
        },
        margin: [0, 0, 0, 10]
      },

      { text: "PARTS", style: "sectitle" },

      {
        table: {
          widths: ["*", 40, 60, 60],
          headerRows: 1,
          body: [
            [
              { text: "DESCRIPTION", bold: true, fontSize: 10 },
              { text: "QNT", bold: true, alignment: "center", fontSize: 10 },
              { text: "AMOUNT", bold: true, alignment: "right", fontSize: 10 },
              { text: "TOTAL AMOUNT", bold: true, alignment: "right", fontSize: 10 }
            ],
            ...partsRows
          ]
        },
        margin: [0, 0, 0, 15]
      },

      {
        text: `Mechanical/Technician: ${jobData.assignedTo}`,
        fontSize: 10,
        margin: [0, 0, 0, 15]
      },

      // TOTALS
{
  text: `Subtotal: ₱${jobData.subtotal.toFixed(2)}`,
  alignment: "right",
  fontSize: 10
},
{
  text: `Discount: ₱${jobData.discount.toFixed(2)}`,
  alignment: "right",
  fontSize: 10
},
{
  text: `Total: ₱${jobData.grandTotal.toFixed(2)}`,
  bold: true,
  alignment: "right",
  fontSize: 11,
  margin: [0, 0, 0, 20]
},

// NOTE SECTION (above signatures)
// SIGNATURES SIDE BY SIDE
{
  columns: [
    {
      width: "50%",
      stack: [
        { text: "General Manager:", fontSize: 9, italics: true },
        { text: "Herminia Baracael", fontSize: 10, bold: true, italics: true },
      ],
      alignment: "center"
    },
    {
      width: "50%",
      stack: [
        { text: "Prepared By:", fontSize: 9, italics: true },
        { text: "Jewell Mabunga", fontSize: 10, bold: true, italics: true },
      ],
      alignment: "center"
    }
  ],
  margin: [0, 20, 0, 30] // spacing from above/below
},


// SIGNATURE BLOCK FIXED AT BOTTOM
{
  absolutePosition: { x: 40, y: 640 },  // adjust for perfect bottom placement
  columns: [
    {
      width: "*",
      stack: [
      {text: "Note: I hereby acknowledge that all items and labor are in good condition/s",fontSize: 9 },
        { text: "\n\nReceived By:", fontSize: 10 },
        { text: "\n\n_____________________________", fontSize: 10 }
      ]
    },
  ]
}
    ],

    styles: {
      header: { fontSize: 16, bold: true },
      subheader: { fontSize: 10 },
      sectitle: { fontSize: 11, bold: true, margin: [0, 5, 0, 5] }
    }
  };

  pdfMake.createPdf(docDefinition).download(`JOB-ORDER-${jobData.joNumber}.pdf`);
};

const loadBase64Image = (url) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    fetch(url)
      .then(res => res.blob())
      .then(blob => {
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
  });
};



  return (
    <div className="admin-container">
      {/* HEADER */}
      <header className="admin-header">
        <div className="content">
          <div className="left">
            <img src={logoSrc} className="admin-logo" alt="Autronicas logo" />
          </div>
          <nav className="admin-nav">
            <button className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>Dashboard</button>
            <button className={activeTab === "jobs" ? "active" : ""} onClick={() => setActiveTab("jobs")}>Job Orders</button>
            <a href="/login" className="logout">Logout</a>
          </nav>
        </div>
      </header>

      <div className="dashboard-content">
        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <>
            <h2>Dashboard Overview</h2>
            <div className="cards-grid">
  <div className="card blue">
    <p className="card-title">Total Products</p>
    <h1 className="card-value">{products.length}</h1>
  </div>

  <div className="card purple">
    <p className="card-title">Total Jobs</p>
    <h1 className="card-value">{jobOrders.length}</h1>
  </div>

  <div className="card green">
    <p className="card-title">Total Sales</p>
    <h1 className="card-value">₱{totalSales.toFixed(2)}</h1>
  </div>
</div>

          </>
        )}

        {/* JOB ORDERS */}
        {activeTab === "jobs" && (
          <div className="joborders-section">
            <div className="joborders-header">
              <h2>Job Order Management</h2>
              <button className="create-joborder-btn" onClick={() => { resetJobForm(); setEditJobIndex(null); setShowJobOrderModal(true); }}>Create New Job Order</button>
            </div>
            <div className="joborders-table-wrapper">
              <table className="joborders-table">
                <thead>
                  <tr>
                    <th>JOB ORDER NO.</th>
                    <th>CLIENT NAME</th>
                    <th>VEHICLE MODEL</th>
                    <th>PLATE NUMBER</th>
                    <th>TOTAL PRICE</th>
                    <th>STATUS</th>
                    <th>ASSIGNED TO</th>
                    <th>DATE IN</th>
                    <th>DATE RELEASE</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {jobOrders.length === 0 ? (
                    <tr><td colSpan="10" className="empty-message">No job orders created yet.</td></tr>
                  ) : (
                    jobOrders.map((o, index) => (
                      <tr key={index}>
                        <td>{o.joNumber}</td>
                        <td>{o.client}</td>
                        <td>{o.vehicleModel}</td>
                        <td>{o.plate}</td>
                        <td>₱{Number(o.total || 0).toFixed(2)}</td>
                        <td>
                          <span className={o.status === "Pending" ? "status-tag yellow" : o.status === "In Progress" ? "status-tag blue" : "status-tag green"}>{o.status}</span>
                        </td>
                        <td>{o.assignedTo}</td>
                        <td>{o.dateIn}</td>
                        <td>{o.dateRelease}</td>
                        <td className="actions">
                          <button className="view-edit-btn" onClick={() => handleEditJob(index)}>Edit</button>
                          <button className="delete-btn" onClick={() => deleteJobOrder(index)} style={{ marginLeft: 8 }}>Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* JOB ORDER MODAL */}
        {showJobOrderModal && (
          <div className="joborder-overlay">
            <div className="joborder-modal">
              <div className="modal-header">
                <p className="joborder-inline"><strong>Job Order No. {editJobIndex !== null ? jobOrders[editJobIndex].joNumber : jobOrderNo}</strong></p>
              <button 
  className="export-btn" 
  onClick={exportJobOrderPDF} 
  disabled={!isJobFormValid()}
>
  Export as PDF
</button>

              </div>

              {/* Modal Body: Form Grid, Services, Parts, Totals */}
              <div className="modal-body">
                <div className="form-grid">
                  <div className="left">
                    <label>Client Name</label>
                    <input type="text" placeholder="Enter client name" value={clientName} onChange={(e) => setClientName(e.target.value)} />
                    <label>Address</label>
                    <input type="text" placeholder="Enter address" value={address} onChange={(e) => setAddress(e.target.value)} />
                    <label>Vehicle Model</label>
                    <input type="text" placeholder="Enter vehicle model" value={vehicleModel} onChange={(e) => setVehicleModel(e.target.value)} />
                    <label>Date In</label>
                    <input type="date" value={dateIn} onChange={(e) => setDateIn(e.target.value)} />
                    <label>Assigned To</label>
                    <input type="text" placeholder="Enter staff name" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} />
                  </div>
                  <div className="right">
                    <label>Customer Type</label>
                    <select value={customerType} onChange={(e) => setCustomerType(e.target.value)}>
                      <option value="">Select</option>
                      <option value="LGU">LGU</option>
                      <option value="Private">Private</option>
                      <option value="STAN">STAN</option>
                    </select>
                    <label>Contact Number</label>
                    <input type="text" placeholder="Enter contact number" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
                    <label>Plate Number</label>
                    <input type="text" placeholder="Enter plate number" value={plateNumber} onChange={(e) => setPlateNumber(e.target.value)} />
                    <label>Date Release</label>
                    <input type="date" value={dateRelease} onChange={(e) => setDateRelease(e.target.value)} />
                    <label>Status</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>
                  </div>
                </div>

                {/* SERVICES */}
                <h3 className="section-title">Services</h3>
                <div className="table-headers services-head">
                  <span>Description</span><span>Unit</span><span>Qty</span><span>Price (PHP)</span><span></span>
                </div>
                {services.map((s, i) => (
                  <div className="item-row services-row" key={`s-${i}`}>
                    <input type="text" placeholder="Description" value={s.description} onChange={(e) => updateService(i, "description", e.target.value)} />
                    <input type="text" placeholder="Unit" value={s.unit} onChange={(e) => updateService(i, "unit", e.target.value)}/>
                    <input type="number" min="0" placeholder="Qty" value={s.qty} onChange={(e) => updateService(i, "qty", e.target.value)} />
                    <input type="number" min="0" step="0.01" placeholder="Price" value={s.price} onChange={(e) => updateService(i, "price", e.target.value)} />
                    <button className="delete-box" onClick={() => deleteService(i)} aria-label="Delete service">✕</button>
                  </div>
                ))}
                <button className="small-btn" onClick={addServiceRow}>+ Add Service</button>

                {/* PARTS */}
                <h3 className="section-title">Parts</h3>
                <div className="table-headers parts-head">
                  <span>Description</span><span>Qty</span><span>Price (PHP)</span><span></span>
                </div>
                {parts.map((p, i) => (
                  <div className="item-row parts-row" key={`p-${i}`}>
                    <input type="text" placeholder="Description" value={p.description} onChange={(e) => updatePart(i, "description", e.target.value)} />
                    <input type="number" min="0" placeholder="Qty" value={p.qty} onChange={(e) => updatePart(i, "qty", e.target.value)} />
                    <input type="number" min="0" step="0.01" placeholder="Price" value={p.price} onChange={(e) => updatePart(i, "price", e.target.value)} />
                    <button className="delete-box" onClick={() => deletePart(i)} aria-label="Delete part">✕</button>
                  </div>
                ))}
                <button className="small-btn" onClick={addPartRow}>+ Add Part</button>

                <hr />
                <div className="totals">
                  <p>Subtotal: ₱{subtotal.toFixed(2)}</p>
                  <p>Discount: ₱{discount.toFixed(2)}</p>
                  <p><b>Total: ₱{grandTotal.toFixed(2)}</b></p>
                </div>
              </div>

              <div className="modal-footer" style={{ justifyContent: "flex-end", gap: 12 }}>
                <button className="footer-btn back" onClick={() => { setShowJobOrderModal(false); setEditJobIndex(null); }}>Cancel</button>
                <button className="footer-btn save" onClick={calculateTotals} title="Recompute totals">Compute</button>
                <button className="footer-btn finalize" onClick={saveJobOrder} disabled={!isJobFormValid()}>Save</button>
              </div>
            </div>
          </div>
        )}

       

      </div>
    </div>
  );
}

export default MechanicDashboard;
