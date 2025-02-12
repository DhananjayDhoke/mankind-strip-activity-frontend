import axios from 'axios';
import { useEffect, useState } from 'react'
import { BASEURL } from '../constant/constant';

const DashboardBox = () => {
    const empId = sessionStorage.getItem("empId")
    const [summaryData,setSummaryData] = useState({})
    const boxItem = [
        { label: 'Total Doctors', class: 'bxcolor1', dataField: 'totalDoctorCount' },
        { label: 'Rxer Doctors', class: 'bxcolor2', dataField: 'totalRxerCount' },
        { label: 'Non Rxer Doctors', class: 'bxcolor3', dataField: 'totalNonRxerCount' },
        //{ label: 'Total Patients Diagnosed', class: 'bxcolor4', dataField: 'totalPaDiagnosed' },
        //{ label: 'Total Prescription Generated', class: 'bxcolor5', dataField: 'totalPrescription' }
    ];

     // for getting summary data 
     const getSummaryData = async () => {
        try {
          const res = await axios.post(`${BASEURL}/record/getRecordData`,{empcode:empId});
          
          if(res.data.errorCode === 1){
              setSummaryData(res.data.data[0])
          }
        } catch (error) {
          console.log(error);
        }
      };
  
    useEffect(() => {
      getSummaryData();
    }, []);

  return (
    <>
    {boxItem.map((item)=>(
            <div key={item.label} className="col-xl-4 col-md-4 mx-auto mb-4">
            <div className={`card shadow  bxstyle ${item.class}`}>
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xl font-weight-bold text-primary m-2  btstyle">
                      {item.label}
                    </div>
                    <div className=" mb-0 font-weight-bold text-gray-800 btstyle1">
                    {summaryData && summaryData[item.dataField]}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          ))} 
    </>
  )
}

export default DashboardBox