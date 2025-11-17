import { Suspense, useEffect, useState } from "react"
import { ButtonGroup, ToggleButton } from "react-bootstrap"
import LoadingSpinner from "../loading/LoadingSpinner"
import { lazy } from "react"
import { useAuth } from "../hooks/useAuth"

const ViewAllUsers = lazy(() => import('./ViewAllUsers'))
const AddUser = lazy(() => import('./AddUser'))
const EditUser = lazy(() => import('./EditUser'))

const UsersMain = () => {
    const { isAuthenticated, getUser } = useAuth()
    const [isAdminOrStaff, setIsAdminOrStaff] = useState(false)
    const [radioValue, setRadioValue] = useState('1')
    let user = getUser()
            
    const radios = [
        { name: 'Search/Edit', value: '1' },
        { name: 'Add New', value: '2' },
        { name: 'List All Users', value: '3' },
    ]

    useEffect(() => {
        const isUserAdminOrStaff = () => {
            if (user !== null) {
                if ((user.decoded.role === 'Admin') || (user.decoded.role === 'Staff'))
                    return true;
                else
                    return false;
            }
        }
        setIsAdminOrStaff(isUserAdminOrStaff())
    }, [user])

    const renderComponent = () => {
        switch(radioValue) {
            case '1':
                return (
                    <Suspense fallback={<LoadingSpinner caption={'Search/Edit User'} clsTextColor={"text-black"} />}>
                        <EditUser />
                    </Suspense>
                )
            case '2':
                return (
                    <Suspense fallback={<LoadingSpinner caption={'Add New User'} clsTextColor={"text-black"} />}>
                        <AddUser />
                    </Suspense>
                )
            case '3':
                return (
                    <Suspense fallback={<LoadingSpinner caption={'List All Users'} clsTextColor={"text-black"} />}>
                        <ViewAllUsers />
                    </Suspense>
                )
            default:
                return <div className="mt-5 text-center"><h2>Not Found</h2></div>
        }
    }

    return (
        <>
            {
                isAuthenticated && isAdminOrStaff ? (
                    <div className="mb-3">
                        <Suspense fallback={<LoadingSpinner caption={'Users'} clsTextColor={"text-black"} />}>
                            <div className="">
                                <h2 className="text-center mb-1">USERS</h2>
                                <ButtonGroup className='border shadow'>
                                    {radios.map((radio, idx) => (
                                        <ToggleButton
                                            key={idx}
                                            id={`radio-user-${idx}`}
                                            type="radio"
                                            variant={'outline-dark'}
                                            name="radio"
                                            value={radio.value}
                                            checked={radioValue === radio.value}
                                            onChange={(e) => setRadioValue(e.currentTarget.value)}
                                        >
                                            {radio.name}
                                        </ToggleButton>
                                    ))}
                                </ButtonGroup>
                                {renderComponent()}
                            </div>
                        </Suspense>
                    </div>
                ) : (
                    <div className="container my-3 p-2">
                        <h3 className="text-primary text-center">Unauthorized</h3>
                    </div>
                )
            }
        </>
        
    )
}

export default UsersMain
