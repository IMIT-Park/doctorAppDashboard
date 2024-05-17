import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useEffect, useState } from 'react';
import IconCoffee from '../../components/Icon/IconCoffee';
import IconMapPin from '../../components/Icon/IconMapPin';
import IconMail from '../../components/Icon/IconMail';
import IconPhone from '../../components/Icon/IconPhone';
import IconEye from '../../components/Icon/IconEye';
import IconCloseEye from '../../components/Icon/IconCloseEye';
import IconLockDots from '../../components/Icon/IconLockDots';
import NetworkHandler from "../../utils/NetworkHandler"
import IconX from '../../components/Icon/IconX';
import IconLoader from '../../components/Icon/IconLoader';
import Swal from 'sweetalert2';


const Profile = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Profile'));
    });

    const userDetails = sessionStorage.getItem("userData");
    const userData = JSON.parse(userDetails);

    const [showPassword, setShowPassword] = useState(false);
    const [data, setData] = useState({ currentPassword: "", newPassword: "" });
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState({ show: false, message: "", type: "info" });
    const [isIncorrect, setIsIncorrect] = useState(false);

    // warning alert closer
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowAlert({ show: false, message: "", type: "info" });
        }, 3000);

        return () => clearTimeout(timer);
    }, [showAlert.show]);

    const handleCloseAlert = () => {
        setShowAlert({ show: false, message: "", type: "info" });
    }

    // change password function
    const handleChangePassword = async (e) => {
        e.preventDefault();

        setLoading(true);

        if (!data.currentPassword || !data.newPassword) {
            setShowAlert({ show: true, message: "Please fill in all iput fields.", type: "warning" });
            setLoading(false);
            return;
        }

        try {
            const response = await NetworkHandler.makePostRequest("/users/resetpassword", data);
            console.log(response);

            if (response.status === 200) {
                console.log(response);
                setIsIncorrect(false);
                showMessage('Password changed successfully.');
                setData({ ...data, currentPassword: "", newPassword: "" });

            } else {
                setShowAlert({ show: true, message: "Current password is incorrect.", type: "danger" });
                setIsIncorrect(true);
            }
        } catch (error) {
            setShowAlert({ show: true, message: "Current password is incorrect.", type: "danger" });
            setIsIncorrect(true);
        } finally {
            setLoading(false);
        }
    }

    const handleCurrentPasswordKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('NewPassword').focus();
        }
    };

    const handleNewPasswordKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleChangePassword(e);
        }
    };

    // show success message 
    const showMessage = (msg = '', type = 'success') => {
        const toast = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li className="">
                    <span>Profile</span>
                </li>
            </ul>
            <div className="pt-5">
                <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-5">
                    <div className="panel">
                        <div className="mb-2">
                            <div className="flex flex-col justify-center items-center">
                                <img src="/assets/images/profile-4.jpeg" alt="img" className="w-36 h-36 rounded-full object-cover  mb-5" />
                                <p className="font-semibold text-primary text-xl capitalize">{userData?.user_name ? userData?.user_name : ""}</p>
                            </div>
                            <ul className="mt-5 flex flex-col max-w-[160px] m-auto space-y-4 font-semibold text-white-dark">
                                <li className="flex items-center gap-2 capitalize">
                                    <IconCoffee className="shrink-0" />
                                    {userData?.role ? userData?.role : "Admin"}
                                </li>
                                <li className="flex items-center gap-2 capitalize">
                                    <IconMapPin className="shrink-0" />
                                    {userData?.address ? userData?.address : ""}
                                </li>
                                <li>
                                    <button className="flex items-center gap-2">
                                        <IconMail className="w-5 h-5 shrink-0" />
                                        <span className="text-primary truncate">{userData?.email ? userData?.email : ""}</span>
                                    </button>
                                </li>
                                <li className="flex items-center gap-2">
                                    <IconPhone />
                                    <span className="whitespace-nowrap" dir="ltr">
                                        {userData?.phone ? `+91 ${userData?.phone}` : ""}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className='lg:col-span-2 xl:col-span-3'>
                        <form className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black"
                            onSubmit={handleChangePassword}
                        >
                            <h6 className="text-lg font-bold mb-5">Change Password</h6>
                            <div className="flex flex-col sm:flex-row">
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label htmlFor="Password">Current Password</label>
                                        <div className={`relative text-white-dark ${isIncorrect && 'has-error'}`}>
                                            <input id="CurrentPassword" type={showPassword ? "text" : "password"} placeholder="Current Password" className="form-input ps-10 pr-9 placeholder:text-white-dark"
                                                value={data.currentPassword}
                                                onChange={(e) => setData({ ...data, currentPassword: e.target.value })}
                                                onKeyDown={handleCurrentPasswordKeyDown}
                                            />
                                            <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                                <IconLockDots fill={true} />
                                            </span>
                                            <span title={showPassword ? 'hide password' : 'show password'} className="absolute end-3 top-1/2 -translate-y-1/2 cursor-pointer select-none" onClick={() => setShowPassword(!showPassword)}>
                                                {showPassword ? <IconEye /> : <IconCloseEye />}
                                            </span>
                                        </div>
                                        {isIncorrect &&
                                            <div className="text-danger mt-0.5 ml-1">Current Password is incorrect !</div>
                                        }
                                    </div>
                                    <div>
                                        <label htmlFor="Password">New Password</label>
                                        <div className="relative text-white-dark">
                                            <input id="NewPassword" type={showPassword ? "text" : "password"} placeholder="New Password" className="form-input ps-10 pr-9 placeholder:text-white-dark"
                                                value={data.newPassword}
                                                onChange={(e) => setData({ ...data, newPassword: e.target.value })}
                                                onKeyDown={handleNewPasswordKeyDown}
                                            />
                                            <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                                <IconLockDots fill={true} />
                                            </span>
                                            <span title={showPassword ? 'hide password' : 'show password'} className="absolute end-3 top-1/2 -translate-y-1/2 cursor-pointer select-none" onClick={() => setShowPassword(!showPassword)}>
                                                {showPassword ? <IconEye /> : <IconCloseEye />}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="sm:col-span-2 mt-3 ml-auto">
                                        <button type="submit" className="btn btn-primary">
                                            {loading ? <IconLoader className="animate-[spin_2s_linear_infinite] inline-block align-middle shrink-0" /> : "Change"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {showAlert.show &&
                <div className={`fixed top-[70px] right-6 flex items-center p-3.5 rounded text-white ${showAlert.type === "warning" ? "bg-warning" : showAlert.type === "danger" ? "bg-danger" : "bg-info"}`}>
                    <span className="ltr:pr-2 rtl:pl-2">
                        <strong>{showAlert?.message}</strong>
                    </span>
                    <button type="button" className="ltr:ml-auto rtl:mr-auto hover:opacity-80" onClick={handleCloseAlert}>
                        <IconX className="w-5 h-5" />
                    </button>
                </div>
            }
        </div>
    );
};

export default Profile;
