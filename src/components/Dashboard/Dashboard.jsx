import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASEURL,DIGIT_REGEX,PageCount, SelectStyle } from "../constant/constant";
import ConfirmationPopup from "../popup/Popup";
//import { toast } from "react-toastify";
import Select from "react-select";
import toast from "react-hot-toast";
import Loader from "../utils/Loader";
import "./Dashboard.css"
import DashboardBox from "./DashboardBox";

//import { ThreeDots } from "react-loader-spinner";
const Dashboard = () => {

  const userId = sessionStorage.getItem("userId");
  //const reporting = sessionStorage.getItem('reporting');
  const empId = sessionStorage.getItem("empId")
 
  // data for select tag

  
  const [brandList, setBrandList] = useState([]);
  const [activityList, setActivityList] = useState([]);
  const [doctorStatusList, setDoctorStatusList] = useState([]);

  const [campDate, setCampDate] = useState("");
  const [doctorStatusId, setDoctorStatusId] = useState("");
  const [recordList, setRecordList] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterBy, setFilterBy] = useState("");
  const [dateRange, setDateRange] = useState(false);
 

  const [addRequestModel, setAddRequestModel] = useState(false);
  const [infoReportModel, setInfoReportModel] = useState(false);
  const [editRequestModel, setEditRequestModel] = useState(false);

  const [infoData, setInfoData] = useState({});
  const [activeDates, setActiveDates] = useState({});
  
 
  
  // for delete

  const [showEditConfirmation, setShowEditConfirmation] = useState(false);
  const [editId, setEditId] = useState("");
  



  // for camp request data

  const [loading, setLoading] = useState(false);
  const [doctorId, setDoctorId] = useState("")
  const [doctorCode, setDoctorCode]= useState("")

  const [selectedActivityOptions, setSelectedActivityOptions] = useState(""); 
  const [skuValues, setSkuValues] = useState([
    { sku1: "", quantity1: "" },
    { sku2: "", quantity2: "" },
    { sku3: "", quantity3: "" },
    { sku4: "", quantity4: "" },
    { sku5: "", quantity5: "" },
    { sku6: "", quantity6: "" },
  ]);

  const handleFilter = (e) => {
     setFilterBy(e.target.value)
 
  };
  

  const handelAddReport = (docId,docCode) => {
    setDoctorId(docId);
    setDoctorCode(docCode)
    setAddRequestModel(true);
  };
 
 
  const handelCloseModel = async () => {
    setAddRequestModel(false);
    setDoctorStatusId('');
    setCampDate('');
    setSelectedActivityOptions("");
    setSkuValues([
     { sku1: "", quantity1: "" },
     { sku2: "", quantity2: "" },
     { sku3: "", quantity3: "" },
     { sku4: "", quantity4: "" },
     { sku5: "", quantity5: "" },
     { sku6: "", quantity6: "" },
   ])
  };

  const handelCloseEditModel = async () => {
    setEditRequestModel(false);
  

    setDoctorStatusId('');
    setCampDate('');
    setSelectedActivityOptions("");
    setSkuValues([
     { sku1: "", quantity1: "" },
     { sku2: "", quantity2: "" },
     { sku3: "", quantity3: "" },
     { sku4: "", quantity4: "" },
     { sku5: "", quantity5: "" },
     { sku6: "", quantity6: "" },
   ])
    
  };

  const handelInfo = async (reportId) => {
    setLoading(true)
    await getCampReportInfoWithId(reportId);
    setLoading(false);
    setInfoReportModel(true);
  };
  const handelCloseInfoModel = () => {
    setInfoReportModel(false);
    setInfoData({});
  };


  const handelCancelEdit = () => {
    setShowEditConfirmation(false);
  };

  

  const getCampReportInfoWithId = async (reportId) => {
    try {
      const res = await axios.post(`${BASEURL}/record/getRecordInfoWithId`, {
        recordId: reportId,
      });
      if (res?.status === 200) {
        setInfoData(res?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //  for showing dashboard list
  const getRecordList = async () => {
   
    setLoading(true)
    try {
      const res = await axios.post(
        `${BASEURL}/general/getDoctorList?searchName=${searchQuery}`,
        { empcode:empId,
          startDate,
          endDate,
          filterBy,
        }
      );
      if (res?.data?.errorCode == 1) {
        setRecordList(res?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
    finally{
      setLoading(false);
    }
  };

  const getRecordList1 = async () => {
   
   // setLoading(true)
    try {
      const res = await axios.post(
        `${BASEURL}/general/getDoctorList?searchName=${searchQuery}`,
        { empcode:empId,
          startDate,
          endDate,
          filterBy,
        }
      );
      if (res?.data?.errorCode == 1) {
        setRecordList(res?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
    
  };

  const getRecordListFilterWise = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASEURL}/general/getDoctorList?searchName=${searchQuery}`,
        {
          empcode: empId,
          startDate,
          endDate,
          filterBy,
        }
      );
  
      if (res?.data?.errorCode == 1) {
        let filteredData = res?.data?.data || [];
  
        // Apply filter based on `filterBy` value
        if (filterBy === "completed") {
          filteredData = filteredData.filter(item => item.status === "Y");
        } else if (filterBy === "pending") {
          filteredData = filteredData.filter(item => item.status !== "Y");
        }
  
        setRecordList(filteredData);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(searchQuery){
      if(searchQuery.length>=3){
        getRecordList1()
      }
    }
    else{
      getRecordListFilterWise();
    }
   
  }, [searchQuery, filterBy]);


  const getBrandList = async () => {
    try {
      const res = await axios.get(`${BASEURL}/general/getBrandList`);
  
      setBrandList(res?.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getActivityList = async () => {
    try {
      const res = await axios.get(`${BASEURL}/general/getActivityList`);
      setActivityList(res?.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getDoctorStatusList = async () => {
    try {
      const res = await axios.get(`${BASEURL}/general/getDoctorStatus`);
      setDoctorStatusList(res?.data.data);
    } catch (error) {
      console.log(error);
    }
  };

 

  // get camp request List
  useEffect(() => {
    getBrandList();
    getActivityList();
    getDoctorStatusList();
  }, []);

  // for search

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleAddSubmit = async () => {
    // Validate required fields
    if (!doctorStatusId) {
      toast.error("Please select the current doctor status.");
      return;
    }
    if(!campDate){
      toast.error("Please select the date");
      return; 
    } 
    if(doctorStatusId == 1){

      if(selectedActivityOptions.length===0){
          toast.error("Please select activity");
          return;
        }
      // Check if at least one pair (both SKU and Quantity) is filled
          const isAnyPairFilled = skuValues.some(item => {
            const values = Object.values(item);
            return values.some(value => value !== ""); // Checks if at least one field has a value
          });

          // Check if any SKU has a missing Quantity or vice versa
          const isValid = skuValues.every(item => {
            const values = Object.values(item);
            return values.every(value => value === "") || values.every(value => value !== "");
          });

          // Extract SKU values and filter out empty ones
            const skus = skuValues
            .map(item => Object.values(item)[0]) // Extract SKU values
            .filter(value => value !== "" && value !== null); // Remove empty/null SKUs

            // Check for duplicates
            const hasDuplicates = new Set(skus).size !== skus.length;

          if (!isAnyPairFilled) {
            toast.error("At least one SKU and Quantity pair is required.");
            return;
          }

          if (!isValid) {
            toast.error("Each SKU must have a corresponding Quantity and vice versa.");
            return;
          }
          if (hasDuplicates) {
            toast.error("Duplicate SKUs are not allowed.");
            return;
          }
          try {
            const res = await axios.post(`${BASEURL}/record/addRecord`,{
              doctorId,
              doctorCode,
              doctorStatusId,
              empcode: empId,
              date: campDate,
              activityValues:selectedActivityOptions,
              skuValues:skuValues
            })
           if(res.data.errorCode == 1){
             toast.success("Record added successfully")
             getRecordList();
             setDoctorId('');
             setDoctorCode('');
             setDoctorStatusId('');
             setCampDate('');
             setSelectedActivityOptions("");
             setSkuValues([
              { sku1: "", quantity1: "" },
              { sku2: "", quantity2: "" },
              { sku3: "", quantity3: "" },
              { sku4: "", quantity4: "" },
              { sku5: "", quantity5: "" },
              { sku6: "", quantity6: "" },
            ])
           }
         } catch (error) {
         console.error("Error submitting the report:", error);
         toast.error("Error submitting the report");
       } finally {
         setAddRequestModel(false);
       }
    }
    else{
      try {
        const res = await axios.post(`${BASEURL}/record/addRecord1`,{
          doctorId,
          doctorCode,
          doctorStatusId,
          empcode: empId,
          date: campDate
        })
       if(res.data.errorCode == 1){
         toast.success("Record added successfully")
         getRecordList();
         setDoctorId('');
         setDoctorCode('');
         setDoctorStatusId('');
         setCampDate('');
       }
   } catch (error) {
     console.error("Error submitting the report:", error);
     toast.error("Error submitting the report");
   } finally {
     setAddRequestModel(false);
   }
  }
   
   
  };

 // Convert doctorList to options for react-select
 const brandOptions = brandList.map((brand) => ({
  value: brand.brand_id,
  label: brand.brand_name,
}));

const activityOptions = activityList.map((activity) => ({
  value: activity.activity_id,
  label: activity.activity_name,
}));



const handleActivityChange = (selected) => {
const selectedValues = selected ? selected.map(option => option.value).join(",") : "";
setSelectedActivityOptions(selectedValues);
//console.log("Selected Values:", selectedValues);
};


const handleSkuChange = (index, selectedOption) => {
  const updatedSkus = [...skuValues];
  updatedSkus[index] = {
    ...updatedSkus[index],
    [`sku${index + 1}`]: selectedOption ? selectedOption.value : "",
  };
  setSkuValues(updatedSkus);
};

const handleQuantityChange = (index, event) => {
  const updatedSkus = [...skuValues];
  const value = event.target.value;
  //console.log("sku values inside",updatedSkus)
  //console.log("inside edit",value,DIGIT_REGEX.test(value))
  if (DIGIT_REGEX.test(value)) { // Only allow numbers
    updatedSkus[index] = {
      ...updatedSkus[index],
      [`quantity${index + 1}`]: value,
    };
    setSkuValues(updatedSkus);
  }
};


  const handleEdit = async (reportId) => {
    setEditId(reportId);
    setLoading(true)
    try {
      const res = await axios.post(`${BASEURL}/record/getRecordInfoWithId`, {
        recordId: reportId,
      });
      if (res.data.errorCode == 1) {
        let infoData = res?.data?.data;
        setCampDate(infoData.date);
        setDoctorStatusId(infoData.doctorStatusId);
        setSelectedActivityOptions(infoData.activityValues);
        setSkuValues(infoData.skuValues)
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
   
    setEditRequestModel(true);
  };

  const handleEditSubmit = () => {

    if(!campDate){
      toast.error("Please select the date");
      return; 
    } 
    if(doctorStatusId == 1){

     

      if(selectedActivityOptions.length===0){
          toast.error("Please select activity");
          return;
        }
      // Check if at least one pair (both SKU and Quantity) is filled
          const isAnyPairFilled = skuValues.some(item => {
            const values = Object.values(item);
            return values.some(value => value !== ""); // Checks if at least one field has a value
          });

          // Check if any SKU has a missing Quantity or vice versa
          const isValid = skuValues.every(item => {
            const sku = Object.values(item)[0]; // First value is SKU
            const quantity = Object.values(item)[2]; // Third value is Quantity
          
            // If both SKU and Quantity are empty, it's valid (empty row)
            if (sku === "" && quantity === "") return true;
          
            // If either SKU or Quantity is missing, it's invalid (partial entry)
            if (sku === "" || quantity === "") return false;
          
            return true; // Valid when both SKU and Quantity are filled
          });

          // Extract SKU values and filter out empty ones
          const skus = skuValues
          .map(item => Object.values(item)[0]) // Extract SKU values
          .filter(value => value !== "" && value !== null); // Remove empty/null SKUs

          // Check for duplicates
          const hasDuplicates = new Set(skus).size !== skus.length;

          if (!isAnyPairFilled) {
            toast.error("At least one SKU and Quantity pair is required.");
            return;
          }

          if (!isValid) {
            toast.error("Each SKU must have a corresponding Quantity and vice versa.");
            return;
          }
          if (hasDuplicates) {
            toast.error("Duplicate SKUs are not allowed.");
            return;
          }
          
    }

    setShowEditConfirmation(true);
   
};

 const handleConfirmEdit = async()=>{
    setShowEditConfirmation(false);

    //console.log("inside conform",editId,selectedActivityOptions,skuValues,doctorStatusId)

    if(doctorStatusId == 1){
      try {
        const res = await axios.post(`${BASEURL}/record/updateRecord`,{
          recordId:editId,
          empcode: empId,
          date: campDate,
          activityValues:selectedActivityOptions,
          skuValues:skuValues
        })
        console.log(res)
       if(res.data.errorCode == 1){
         toast.success("Record updated successfully")
         getRecordList();
         setDoctorStatusId('');
         setCampDate('');
         setSelectedActivityOptions("");
         setSkuValues([
          { sku1: "", quantity1: "" },
          { sku2: "", quantity2: "" },
          { sku3: "", quantity3: "" },
          { sku4: "", quantity4: "" },
          { sku5: "", quantity5: "" },
          { sku6: "", quantity6: "" },
        ])
        setEditId('');
       }
     } catch (error) {
     console.error("Error submitting the report:", error);
     toast.error("Error submitting the report");
   } finally {
    setEditRequestModel(false);
   }
    }
    else{
      try {
        const res = await axios.post(`${BASEURL}/record/updateRecord1`,{
          recordId:editId,
          empcode: empId,
          date: campDate
        })
       if(res.data.errorCode == 1){
         toast.success("Record updated successfully")
         getRecordList();
         setDoctorStatusId('');
         setCampDate('');
         setEditId('');
       }
   } catch (error) {
     console.error("Error submitting the report:", error);
     toast.error("Error submitting the report");
   } finally {
     setEditRequestModel(false);
   }
  }

 }
 

  // pagination logic
  const [page, setPage] = useState(1);

  const selectPageHandler = (selectedPage) => {
    if (
      selectedPage >= 1 &&
      selectedPage <= Math.ceil(recordList.length / PageCount) &&
      page !== selectedPage
    )
      setPage(selectedPage);
  };


  const renderPageNumbers = () => {
    const totalPages = Math.ceil(recordList.length / PageCount);
    const pageNumbers = [];
    const maxPageNumbersToShow = PageCount - 10;

    if (totalPages <= maxPageNumbersToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const startPage = Math.max(2, page - 2);
      const endPage = Math.min(totalPages - 1, page + 2);

      pageNumbers.push(1); // Always show the first page
      
      if (startPage > 2) {
        pageNumbers.push("..."); // Ellipsis before startPage if there's a gap
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages - 1) {
        pageNumbers.push("..."); // Ellipsis after endPage if there's a gap
      }

      pageNumbers.push(totalPages); // Always show the last page
    }

    // Fix for the duplicate key issue by using a combination of index and pageNum
    return pageNumbers.map((pageNum, index) =>
      pageNum === "..." ? (
        <li className="page-item" key={`ellipsis-${index}`}>
          <span className="page-link">{pageNum}</span>
        </li>
      ) : (
        <li
          className={`page-item ${page === pageNum ? "active" : ""}`}
          onClick={() => selectPageHandler(pageNum)}
          key={`page-${pageNum}`} // Ensure unique key for page numbers
        >
          <span className="page-link">{pageNum}</span>
        </li>
      )
    );
  };
    
  const getActiveDates = async()=>{
    try {
        const res = await axios.get(`${BASEURL}/general/getActiveDates`);
        console.log(res)
        if(res.data.errorCode == 1){
         setActiveDates(res.data.data[0]);
        }
    } catch (error) {
     console.log(error);
    }
  }

  useEffect(()=>{
    getActiveDates();
  },[])

  const now = new Date(); // Get current date
  const activeStartDate = new Date(activeDates.start_date);
  const activeEndDate = new Date(activeDates.end_date);

  // Check if today's date is within the given range
  //const isWithinDateRange = now >= activeStartDate && now <= activeEndDate;
   const isWithinDateRange = true;
  console.log("active dates",activeDates,isWithinDateRange);
  console.log("info data doctor status id",infoData, doctorStatusId)
  
  return loading ? <Loader/> : (
    <>
      <main id="main" className="main">
      <div className="row">
          <DashboardBox />
        </div>
        <section className="section dashboard">
          <div className="row">
            <div className="d-sm-flex align-items-center mb-4">
              {/* <div className="dropdown mt-4" style={{ marginLeft: "1%" }}>
                <select
                  className="form-control form-control1  selectStyle"
                   onChange={handleFilterByBrand}
                   value={filterByBrand}
                >
                  <option value="">All Brands</option>
                  {brandList.map((e) => (
                            <option key={e.brand_id} value={e.brand_id}>
                              {e.description}
                            </option>
                          ))}
                </select>
              </div> */}
              
              {/* <div className="dropdown mt-4" style={{ marginLeft: "1%" }}>
                <select
                  className="form-control form-control1 selectStyle"
                   onChange={handleFilter}
                   value={filterBy}
                >
                  <option value="">All Filter</option>
                  <option value="month">Month</option>
                   <option value="quarter">Quarter</option> 
                   <option value="year">Year</option> 
                  <option value="date">Date Range</option>
                </select>
              </div> */}

               <div className="dropdown mt-4" style={{ marginLeft: "1%" }}>
                <select
                  className="form-control form-control1 selectStyle"
                   onChange={handleFilter}
                   value={filterBy}
                >
                  <option value="">All Filter</option>
                  <option value="completed">Completed</option>
                   <option value="pending">Pending</option> 
                </select>
              </div>

              
              {dateRange && <>
                <div className="form-group ml-2" style={{ marginLeft: "1%" }}>
                <label htmlFor="fromDate">From Date:</label>
                <input
                  type="date"
                  className="form-control"
                  id="fromDate"
                  placeholder="Select From Date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="form-group ml-2" style={{ marginLeft: "1%" }}>
                <label htmlFor="toDate">To Date:</label>
                <input
                  type="date"
                  className="form-control"
                  id="toDate"
                  placeholder="Select To Date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              </>}
              <form className="d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                <div className="input-group mt-4" style={{ marginLeft: "10px" }}>
                  <input
                    type="search"
                    className="form-control"
                    placeholder="Search."
                    aria-label="Search."
                    aria-describedby="basic-addon2"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <span className="input-group-text" id="basic-addon2">
                    <i className="bi bi-search"></i>
                  </span>
                </div>
              </form>
             
            </div>

            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  
                  <hr />
                  <div className="">
                    <table className="table table-hover newcss">
                      <thead>
                        <tr>
                          <th scope="col">Doctor code</th>
                          <th scope="col">Doctor name</th>
                          <th scope="col">Speciality</th>
                          <th scope="col">Qualification</th>
                          <th scope="col">Status</th>
                          <th scope="col">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recordList &&
                          recordList.length > 0 &&
                          recordList
                            .slice(page * PageCount - PageCount, page * PageCount)
                            .map((e) => (
                              <tr key={e.doctor_id}>
                                <td>{e.doctor_code}</td>
                                <td>{e.name}</td>
                                <td>{e.speciality}</td>
                                <td>{e.qualification}</td>
                                <td>
                                 {e.status === 'Y' ? <span className="badge bg-success">
                                  Complete
                                </span>
                                :<span className="badge bg-warning">
                                  Pending
                                </span>}
                                </td>
                                

                                <td>
                                <div className="dropdown-container">
                                  <button className="gear-button">
                                    <i className="ri-settings-3-fill"></i>
                                  </button>

                                  <div className="dropdown-menu">
                                    {e.status === 'Y' ? <>
                                      <button onClick={() => handelInfo(e.record_id)} className="dropdown-item">
                                      <i className="ri-information-line"></i> Information
                                    </button>
                                    {isWithinDateRange && <button onClick={() => handleEdit(e.record_id)} className="dropdown-item">
                                      <i className="ri-edit-line"></i> Edit
                                    </button>}</>:
                                    ( isWithinDateRange && <button onClick={()=>handelAddReport(e.doctor_id,e.doctor_code)} className="dropdown-item">
                                    <i className="ri-add-line"></i> Add Record
                                    </button>)
                                    }
                                    
                                  </div>
                                </div>
                                </td>
                              </tr>
                            ))}
                      </tbody>
                    </table>
                  </div>

                  {recordList && recordList.length > 0 && (
                    <div>
                      <div className="m-2 float-end">
                        {/* <h5 className="card-title">Pagination with icon</h5> */}

                        <nav aria-label="Page navigation example">
                          <ul className="pagination pcur">
                            <li
                              className="page-item"
                              onClick={() => selectPageHandler(page - 1)}
                            >
                              <span className="page-link" aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                              </span>
                            </li>
                            {renderPageNumbers()}
                            <li
                              className="page-item"
                              onClick={() => selectPageHandler(page + 1)}
                            >
                              <span className="page-link" aria-label="Next">
                                <span aria-hidden="true">&raquo;</span>
                              </span>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>



      {infoReportModel && (
        <div className="addusermodel">
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Record Info</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handelCloseInfoModel}
                  ></button>
                </div>
                <div className="modal-body">
                 
                  <form className="row g-3">
                    
                    <div className="row g-3">
                    <div className="col-md-6 did-floating-label-content">
                      <input
                        type="text"
                        className="form-control did-floating-input"
                        placeholder="Doctor Status"
                        value={infoData && infoData.doctor_status}
                        readOnly
                      />
                      <label className="form-label did-floating-label">
                        Doctor Status
                      </label>
                    </div>

                    <div className="col-md-6 did-floating-label-content">
                      <input
                        type="text"
                        className="form-control did-floating-input"
                        placeholder="Date"
                        value={infoData && infoData.date.split("-").reverse().join("/")}
                        readOnly
                      />
                      <label className="form-label did-floating-label">
                        Date
                      </label>
                     </div>
                    </div>

                    {infoData && infoData.activityName &&
                     <div className="row">
                      <div className="col-md-6 did-floating-label-content">
                      <input
                        type="text"
                        className="form-control did-floating-input"
                        placeholder="Activity Name"
                        value={infoData && infoData.activityName}
                        readOnly
                      />
                      <label className="form-label did-floating-label">
                        Activity Name
                      </label>
                    </div>
                  </div>
                    }

                    {infoData && infoData.skuValues.length > 0 && 
                        infoData.skuValues
                        .map((data, index) => {
                          const sku = data[`sku${index + 1}`];
                          if(sku !==""){
                            return (
                              <div key={index} className="row">
                                  {/* SKU Input */}
                                  <div className="col-md-6 did-floating-label-content">
                                      <input
                                          type="text"
                                          className="form-control did-floating-input"
                                          placeholder={`SKU ${index + 1}`}
                                          value={data[`skuName${index + 1}`] || ""} // Dynamically access sku1, sku2, etc.
                                          readOnly
                                      />
                                      <label className="form-label did-floating-label">
                                          SKU {index + 1}
                                      </label>
                                  </div>
  
                                  {/* Quantity Input */}
                                  <div className="col-md-6 did-floating-label-content">
                                      <input
                                          type="text"
                                          className="form-control did-floating-input"
                                          placeholder={`SKU ${index + 1} QTY`}
                                          value={data[`quantity${index + 1}`] || ""} // Dynamically access quantity1, quantity2, etc.
                                          readOnly
                                      />
                                      <label className="form-label did-floating-label">
                                          SKU {index + 1} QTY
                                      </label>
                                  </div>
                              </div>
                          )
                          }
                        })
                    }
                  </form>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

     

      {addRequestModel && (
        <div className="addusermodel">
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add Record</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handelCloseModel}
                  ></button>
                </div>
                <div className="modal-body">
                  
                    <form className="row g-3">

                    <div className="row g-3">
                      <div className="form-group col-md-6 did-floating-label-content">
                      <select
                        className="form-control did-floating-select"
                        onChange={(event)=>{
                          setDoctorStatusId(event.target.value);
                        }}

                        value={doctorStatusId}
                      >
                        <option value="">Select...</option>
                        {doctorStatusList.map((e) => (
                          <option key={e.basic_id} value={e.basic_id}>
                            {e.description}
                          </option>
                        ))}
                      </select>
                      <label className="form-label did-floating-label">
                        Doctor Status
                      </label>
                    </div>
                    {doctorStatusId == 1 &&<div className="form-group col-md-6 did-floating-label-content">
                      
                      <Select
                            options={activityOptions}
                            value={activityOptions.filter(option => selectedActivityOptions.split(",").includes(option.value.toString()))}
                            onChange={handleActivityChange}
                            placeholder="Select Activity"
                            isClearable
                            isMulti
                            styles={SelectStyle}
                          />
                      {/* <select
                        className="form-control did-floating-select"
                        onChange={(event)=>{
                          setActivityId(event.target.value);
                        }}

                        value={activityId}
                      >
                        <option value="">Select...</option>
                        {activityList.map((e) => (
                          <option key={e.activity_id} value={e.activity_id}>
                            {e.activity_name}
                          </option>
                        ))}
                      </select> */}
                      {/* <label className="form-label did-floating-label">
                        Activity Name
                      </label> */}
                    </div>}
                    </div>
                    
                     
                       {doctorStatusId == 1 && 
                       <>
                         {skuValues.map((item, index) => (
                      <div key={index} className="row">
                        <div className="form-group col-md-6 did-floating-label-content">
                          <Select
                            options={brandOptions}
                            value={brandOptions.find((option) => option.value === item[`sku${index + 1}`])}
                            onChange={(selectedOption) => handleSkuChange(index, selectedOption)}
                            placeholder={`SKU-${index + 1}`}
                            isClearable
                            styles={SelectStyle}
                          />
                        </div>

                        <div className="form-group  col-md-6 did-floating-label-content">
                          <input
                            type="text"
                            className="form-control did-floating-input"
                            placeholder={`Enter Quantity ${index + 1}`}
                            value={item[`quantity${index + 1}`]}
                            onChange={(e) => handleQuantityChange(index, e)}
                            maxLength={3}
                          />
                          <label className="form-label did-floating-label">
                            SKU-{index + 1} QTY (in Strips)
                          </label>
                        </div>
                      </div>
                        ))}
                      
                       </>}

                       <div
                        className="form-group col-md-6 did-floating-label-content"
                        onClick={() => document.getElementById('campDateInput').showPicker()} // Trigger Date Picker
                       
                      >
                        <input
                          id="campDateInput"
                          type="date"
                          className="form-control did-floating-input pcur"
                          onChange={(e) => setCampDate(e.target.value)}
                          placeholder="Date"
                          value={campDate}
                          //min={new Date().toISOString().split('T')[0]}
                          
                        />
                        <label className="form-label did-floating-label">Date</label>
                      </div>  
                    </form>
                  
                    <div className="text-center">
                      
                      <button
                        type="button"
                        className="btn btn-success mx-auto ml-1 mt-1"
                        //onClick={handleImageUpload}
                        onClick={handleAddSubmit}
                      >
                        Submit
                      </button>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {editRequestModel && (
        <div className="addusermodel">
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Record</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handelCloseEditModel}
                ></button>
              </div>
              <div className="modal-body">
                    <form className="row g-3">

                  <div className="row g-3">
                    <div className="form-group col-md-6 did-floating-label-content">
                    <select
                      className="form-control did-floating-select"
                      onChange={(event)=>{
                        setDoctorStatusId(event.target.value);
                      }}

                      value={doctorStatusId}
                      disabled
                    >
                      <option value="">Select...</option>
                      {doctorStatusList.map((e) => (
                        <option key={e.basic_id} value={e.basic_id}>
                          {e.description}
                        </option>
                      ))}
                    </select>
                    {/* <label className="form-label did-floating-label">
                      Doctor Status
                    </label> */}
                  </div>
                  {doctorStatusId == 1 &&
                  <div className="form-group col-md-6 did-floating-label-content">
                    <Select
                          options={activityOptions}
                          value={activityOptions && activityOptions.filter(option => 
                            (selectedActivityOptions ? selectedActivityOptions.split(",") : []).includes(option.value.toString())
                          )}
                          onChange={handleActivityChange}
                          placeholder="Select Activity"
                          isClearable
                          isMulti
                          styles={SelectStyle}
                        />
                  </div>}
                  </div>

      
        {doctorStatusId == 1 && 
        <>
          {skuValues.map((item, index) => (
           <div key={index} className="row">
          <div className="form-group col-md-6 did-floating-label-content">
            <Select
              options={brandOptions}
              value={brandOptions.find((option) => option.value === item[`sku${index + 1}`])}
              onChange={(selectedOption) => handleSkuChange(index, selectedOption)}
              placeholder={`SKU-${index + 1}`}
              isClearable
              styles={SelectStyle}
            />
          </div>

          <div className="form-group  col-md-6 did-floating-label-content">
            <input
              type="text"
              className="form-control did-floating-input"
              placeholder={`Enter Quantity ${index + 1}`}
              value={item[`quantity${index + 1}`]}
              onChange={(e) => handleQuantityChange(index, e)}
              maxLength={3}
            />
            <label className="form-label did-floating-label">
              SKU-{index + 1} QTY (in Strips)
            </label>
          </div>
        </div>
          ))}
        
        </>}

        <div
          className="form-group col-md-6 did-floating-label-content"
          onClick={() => document.getElementById('campDateInput').showPicker()} // Trigger Date Picker
        
        >
          <input
            id="campDateInput"
            type="date"
            className="form-control did-floating-input pcur"
            onChange={(e) => setCampDate(e.target.value)}
            placeholder="Date"
            value={campDate}
           // min={new Date().toISOString().split('T')[0]}
            
          />
          <label className="form-label did-floating-label">Date</label>
        </div>  
                    </form>
                  <div className="text-center">   
                    <button
                      type="button"
                      className="btn btn-success mx-auto ml-1 mt-1"
                      onClick={handleEditSubmit}
                    >
                      Submit
                    </button>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {showEditConfirmation && (
        <ConfirmationPopup
          message="Are you sure you want to update record?"
          onConfirm={handleConfirmEdit}
          onCancel={handelCancelEdit}
        />
      )}
    </>
  );
};

export default Dashboard;
