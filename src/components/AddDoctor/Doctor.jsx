import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASEURL, PageCount } from "../constant/constant";
import ConfirmationPopup from "../popup/Popup";
import toast from "react-hot-toast";
import Loader from "../utils/Loader";
const Doctor = () => {

  //const [searchQuery, setSearchQuery] = useState("");

  const userId = sessionStorage.getItem("userId");
  const userName = sessionStorage.getItem("name");
  const empId = sessionStorage.getItem('empId');
  const role = sessionStorage.getItem('role');
  const [doctorList, setDoctorList] = useState([]);
  const [doctorName, setDoctorName] = useState('');
  const [uinNumber, setUinNumber] = useState('');
  const [qualification, setQualification] = useState('');

  const [addDoctorModel, setAddDoctorModel] = useState(false);
  const [editDoctorModel, setEditDoctorModel] = useState(false);
  const [editId, setEditId] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [delId, setDelId] = useState("");
  const [loading, setLoading] = useState(false);

  const handelAddDoctor = () => {
    if(doctorList.length>50){
      toast.error("You can add upto 50 doctor"); 
      return;
    }
    setAddDoctorModel(true);
  };
 
  const handelCloseModel = async () => {
    setAddDoctorModel(false);
  };
  
  const getDoctor = async () => {
  setLoading(true);
    try {
      const res = await axios.post(`${BASEURL}/report/getDoctor`,{empId,role});
      setDoctorList(res?.data?.data);
    } catch (error) {
      console.log(error);
    }
    finally{
      setLoading(false);
    }
  };

  const handelAddDoctorData = async (event) => {
    event.preventDefault();
    // Validate required fields
     
    
    if (
      !doctorName ||
      !uinNumber ||
      !qualification
    ) {
      toast.error("Missing Required Field");
      return;
    }
    
    try {

      const doctorResponse = await axios.post(`${BASEURL}/report/addDoctor`,
        {
          doctorName,
          uinNumber,
          qualification,
          role,
          empId
        }
      );
       
      if (doctorResponse?.data?.errorCode === "2") {
        toast.success('Doctor UIN number already present try with different one')
        return;
      }

      if (doctorResponse?.data?.errorCode === "1") {
          setDoctorName('');
          setUinNumber('');
          setQualification('');
          setAddDoctorModel(false);
          getDoctor();
          toast.success('Doctor added successfully')
      }
    } catch (error) {
      console.error("Error in adding doctor:", error);
      toast.error("Error In Adding Doctor");
  }
}

const handleEdit =(doctorId) => {
  setEditId(doctorId);

  const selectedData = doctorList.filter((e)=>e.cdoc_id == doctorId);

  //console.log(selectedData);
 
  if(selectedData){
      setDoctorName(selectedData[0].doctor_name);
      setUinNumber(selectedData[0].uin_number);
      setQualification(selectedData[0].doctor_qualification);
      setEditDoctorModel(true);

  }
  
};


const handelEditDoctorData = async()=>{
   
  if (
    !doctorName ||
    !uinNumber ||
    !qualification
  ) {
    toast.error("Missing Required Field");
    return;
  }
  
  try {

    const doctorResponse = await axios.post(`${BASEURL}/report/editDoctor`,
      {
        doctorName,
        uinNumber,
        qualification,
        doctorId:editId
      }
    );
    if (doctorResponse?.data?.errorCode === "2") {
      toast.success('Doctor UIN number already present try with different one')
      return;
    }
    if (doctorResponse?.data?.errorCode === "1") {
        setDoctorName('');
        setUinNumber('');
        setQualification('');
        setEditId('');
        setEditDoctorModel(false);
        getDoctor();
        toast.success('Doctor updated successfully')
    }
  } catch (error) {
    console.error("Error in Editing doctor:", error);
    toast.error("Error In Editing Doctor");
  }
  
}

const handelCloseEditModel = () => {
  setDoctorName('');
  setUinNumber('');
  setQualification('');
  setEditDoctorModel(false);
};

  useEffect(()=>{
    getDoctor();
  },[])

 

  const handelDelete = (doctorId) => {
    setShowDeleteConfirmation(true);
    setDelId(doctorId);
  };
  const handelCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setDelId("");
  };

  const handleConfirmDelete = async () => {
    setShowDeleteConfirmation(false);
    try {
      const res = await axios.post(`${BASEURL}/report/deleteDoctor`, {
        doctorId : delId,
      });

      if (res.data.errorCode == "1") {
        toast.success("Doctor Deleted Successfully");
        getDoctor();
        setDelId("");
      } else {
        toast.error(`Failed to delete Doctor with ID ${delId}`);
      }
    } catch (error) {
      toast.error('Error in deleting doctor');
      console.log(error.message);
    }
  };

  // const handleSearchChange = (event) => {
  //   setSearchQuery(event.target.value);
  // };


  const [page, setPage] = useState(1);

  const selectPageHandler = (selectedPage) => {
    if (
      selectedPage >= 1 &&
      selectedPage <= Math.ceil(doctorList.length / PageCount) &&
      page !== selectedPage
    )
      setPage(selectedPage);
  };


  // const renderPageNumbers = () => {
  //   const totalPages = Math.ceil(doctorList.length / PageCount);
  //   const pageNumbers = [];
  //   const maxPageNumbersToShow = PageCount;

  //   if (totalPages <= maxPageNumbersToShow) {
  //     for (let i = 1; i <= totalPages; i++) {
  //       pageNumbers.push(i);
  //     }
  //   } else {
  //     const startPage = Math.max(2, page - 2);
  //     const endPage = Math.min(totalPages - 1, page + 2);

  //     pageNumbers.push(1);
  //     if (startPage > 2) {
  //       pageNumbers.push("...");
  //     }
  //     for (let i = startPage; i <= endPage; i++) {
  //       pageNumbers.push(i);
  //     }
  //     if (endPage < totalPages - 1) {
  //       pageNumbers.push("...");
  //     }
  //     pageNumbers.push(totalPages);
  //   }

  //   return pageNumbers.map((pageNum, index) =>
  //     pageNum === "..." ? (
  //       <li className="page-item" key={index}>
  //         <span className="page-link">{pageNum}</span>
  //       </li>
  //     ) : (
  //       <li
  //         className={`page-item ${page === pageNum ? "active" : ""}`}
  //         onClick={() => selectPageHandler(pageNum)}
  //         key={pageNum}
  //       >
  //         <span className="page-link">{pageNum}</span>
  //       </li>
  //     )
  //   );
  // };
  
  const renderPageNumbers = () => {
    const totalPages = Math.ceil(doctorList.length / PageCount);
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


  console.log("doctor list",doctorList);
  return loading ? <Loader/> : (
    <>
      <main id="main" className="main">
        {/* <div className="pagetitle">
          <h1>Report for Camp</h1>
        </div> */}

        <section className="section dashboard">
          <div className="row">
            {/* <div className="d-sm-flex align-items-center justify-content-end mb-4">
              <form className="d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                <div className="input-group mt-4">
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
            </div> */}

            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="m-3">
                    <button
                      type="button"
                      //className={`btn ${doctorList.length>15 ? "btn-dis":"btn-success"}`}
                      className= "btn  btn-success"

                      onClick={handelAddDoctor}
                    >
                      <i className="bx bx-plus"></i> Add Doctor
                    </button>
                  </div>
                  <hr />
                  <div className="tbst">
                    <table className="table table-hover newcss">
                      <thead>
                        <tr>
                           <th scope="col">UIN Number</th>
                          <th scope="col">Doctor Name</th>
                          <th scope="col">Specialty</th>
                          <th scope="col">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {doctorList &&
                          doctorList.length > 0 &&
                          doctorList.slice(page * PageCount - PageCount, page * PageCount)
                            .map((e) => (
                              <tr key={e.cdoc_id}>
                                <td>{e.uin_number}</td>
                                <td>{e.doctor_name}</td>
                                <td>{e.doctor_qualification}</td>
                                
                                <td>
                                  <button
                                    className="btn btn-dark rounded-pill ml-1 mb-1"
                                    title="Edit"
                                    onClick={() => handleEdit(e.cdoc_id)}
                                  >
                                    <i className="ri-edit-2-fill"></i>
                                  </button>
                                  <button
                                    className="btn btn-danger rounded-pill ml-1 mb-1"
                                    title="Delete"
                                    onClick={() => handelDelete(e.cdoc_id)}
                                  >
                                    <i className="ri-delete-bin-2-fill"></i>
                                  </button>
                                </td>
                              </tr>
                            ))}
                      </tbody>
                    </table>
                  </div>

                  {doctorList && doctorList.length > 0 && (
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

      {addDoctorModel && (
        <div className="addusermodel">
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog modal-xl">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add Doctor</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handelCloseModel}
                  ></button>
                </div>
                <div className="modal-body">
                    <form className="row g-3">
                      
                      <div className="form-group col-md-4 did-floating-label-content">
                        <input
                          type="text"
                          className="form-control did-floating-input"
                          placeholder="Doctor Name"
                          value={doctorName}
                          maxLength={50}
                          onChange={(e)=>{
                             setDoctorName(e.target.value)
                          }}
          
                        />
                        <label className="form-label did-floating-label">
                          Doctor Name
                        </label>
                      </div>

                      <div className="form-group col-md-4 did-floating-label-content">
                        <input
                          type="text"
                          className="form-control did-floating-input"
                          placeholder="UIN  Number"
                          maxLength={10}
                          value={uinNumber}
                          onChange={(e)=>{
                            setUinNumber(e.target.value);
                          }}
                     
                        />

                        <label className="form-label did-floating-label">
                          UIN Number
                        </label>
                      </div>
                      <div className="form-group col-md-4 did-floating-label-content">
                        <input
                          type="text"
                          className="form-control did-floating-input"
                          placeholder="Doctor Specialty"
                          maxLength={50}
                          value={qualification}
                          onChange={(e)=>{
                            setQualification(e.target.value);
                          }}
                        />

                        <label className="form-label did-floating-label">
                           Doctor Specialty
                        </label>

                      </div>
                      <div className="form-group col-md-4 did-floating-label-content">
                        <input
                          type="text"
                          className="form-control did-floating-input"
                          placeholder="ME Name"
                          //maxLength={50}
                          value={userName}
                          // onChange={(e)=>{
                          //   setQualification(e.target.value);
                          // }}
                          readOnly
                        />

                        <label className="form-label did-floating-label">
                           ME Name
                        </label>

                      </div>
                        <div className="text-center">
                        <button
                          type="submit"
                          className="btn btn-success mx-auto"
                          onClick={handelAddDoctorData}
                        >
                          Submit
                        </button>
                        </div>
                    </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {editDoctorModel && (
        <div className="addusermodel">
          <div
            className="modal fade show"
            style={{ display: "block" }}
            //id="ExtralargeModal"
          >
            <div className="modal-dialog modal-xl">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Doctor</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handelCloseEditModel}
                  ></button>
                </div>
                <div className="modal-body">
                <form className="row g-3">
                      
                      <div className="form-group col-md-4 did-floating-label-content">
                        <input
                          type="text"
                          className="form-control did-floating-input"
                          placeholder="Doctor Name"
                          value={doctorName}
                          maxLength={50}
                          onChange={(e)=>{
                             setDoctorName(e.target.value)
                          }}
          
                        />
                        <label className="form-label did-floating-label">
                          Doctor Name
                        </label>
                      </div>

                      <div className="form-group col-md-4 did-floating-label-content">
                        <input
                          type="text"
                          className="form-control did-floating-input"
                          placeholder="UIN  Number"
                          maxLength={10}
                          value={uinNumber}
                          onChange={(e)=>{
                            setUinNumber(e.target.value);
                          }}
                     
                        />

                        <label className="form-label did-floating-label">
                          UIN Number
                        </label>
                      </div>
                      <div className="form-group col-md-4 did-floating-label-content">
                        <input
                          type="text"
                          className="form-control did-floating-input"
                          placeholder="Doctor Specialty"
                          maxLength={50}
                          value={qualification}
                          onChange={(e)=>{
                            setQualification(e.target.value);
                          }}
                        />

                        <label className="form-label did-floating-label">
                           Doctor Specialty
                        </label>

                      </div>
                </form>
                        <div className="text-center">
                        <button
                          type="submit"
                          className="btn btn-success mx-auto"
                          onClick={handelEditDoctorData}
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

      {showDeleteConfirmation && (
        <ConfirmationPopup
          message="Are you sure you want to Delete Doctor?"
          onConfirm={handleConfirmDelete}
          onCancel={handelCancelDelete}
        />
      )}
    </>
  );
};

export default Doctor;
