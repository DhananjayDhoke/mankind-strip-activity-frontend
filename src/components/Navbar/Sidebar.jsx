import React from 'react'
import { NavLink } from 'react-router-dom'

const Sidebar = ({toggleSideBar}) => {

  return (
    <div>
        {/* ======= Sidebar ======= */}
        <aside className="sidebar" style={{ left: toggleSideBar ? "0" : "" }}>
            <ul className="sidebar-nav">
              <li className="nav-item">
                <NavLink to={'/dashboard'} className={({isActive})=> isActive? "nav-link" :"nav-link collapsed"}>
                  <i className="bi bi-grid"></i>
                  <span>Dashboard</span>
                </NavLink>
              </li>
             
              {/* <li className="nav-item">
                <NavLink to={'/addDoctor'} className={({isActive})=> isActive? "nav-link" :"nav-link collapsed"}>
                  <i className="bi bi-person-add"></i>
                  <span>Add Doctor</span>
                </NavLink>
              </li> */}
            </ul>
          </aside>
          {/* End Sidebar */}
    </div>
  )
}

export default Sidebar