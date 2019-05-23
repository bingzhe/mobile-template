// userid
export const getUserid = () => {
  return window.Store.GetGlobalData('USERID')
}
export const setUserid = (v) => {
  return window.Store.SetGlobalData('USERID', v)
}
export const delUserid = () => {
  return window.Store.DeleteGlobalData('USERID')
}

// employee_id
export const getEmployeeId = () => {
  return window.Store.GetGlobalData('F_EMPLOYEEID')
}
export const setEmployeeId = (v) => {
  return window.Store.SetGlobalData('F_EMPLOYEEID', v)
}
export const delEmployeeId = () => {
  return window.Store.DeleteGlobalData('F_EMPLOYEEID')
}
