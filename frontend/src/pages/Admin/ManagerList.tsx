import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { AppDispatch, RootState } from '../../app/store';
import { blockUser, getAllManagers } from '../../features/admin/adminSlice';


const ManagerList : React.FC = ()=> {
    const dispatch = useDispatch<AppDispatch>()
    const { managers, isError, message } = useSelector((state: RootState) => state.adminAuth);


    useEffect(()=>{
      const fetchManagers = async() => {
        try {
          await dispatch(getAllManagers()).unwrap()
        } catch (error) {
          toast.error('Error fetching users', {
            className: 'toast-custom',
          });
        }
      }
      fetchManagers()
      if (isError) {
        toast.error(message, {
          className: 'toast-custom',
        });
      }
    },[dispatch, isError, message])

    const handleBlockUser = async(userId: string,status: boolean) => {
      console.log('userId',userId);
      try {
        await dispatch(blockUser(userId)).unwrap()
        const message = status
        ? 'Manager unblocked successfully!'
        : 'Manager blocked successfully!';
        
        toast.success(message,{
          className:'toast-custom'
        });
        await dispatch(getAllManagers()).unwrap();

    } catch (error) {
        toast.error('Failed to update user: ' + error,{
          className:'toast-custom'
        });
    }
  };
  

    return (
      <>
        <h1 className="text-black text-4xl font-bold mb-5">Manager List</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-3 px-5 bg-gray-200 border-b text-left text-gray-800 font-semibold">Manager Name</th>
                <th className="py-3 px-5 bg-gray-200 border-b text-left text-gray-800 font-semibold">Email</th>
                <th className="py-3 px-5 bg-gray-200 border-b text-left text-gray-800 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {managers && managers.length > 0 ? (
                managers.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-100">
                    <td className="py-3 px-5 border-b">{u.name}</td>
                    <td className="py-3 px-5 border-b">{u.email}</td>
                    <td className="py-3 px-5 border-b">
                      <button className={`py-1 px-3 rounded text-white ${u.isBlocked ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
                          onClick={()=>{
                            if (u._id) {
                              handleBlockUser(u._id, u.isBlocked);
                            } else {
                              console.error("User ID is undefined");
                            }}} >
                        {u.isBlocked ? 'Unblock' : 'Block'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-3 px-5 border-b">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </>
    )  
}

export default ManagerList