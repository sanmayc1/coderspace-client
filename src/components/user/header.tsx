import { Crown, LoaderCircle, Menu, X, Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import { navIcons, navHeads } from '@/utils/constants';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks/redux-custom-hook';
import { logout } from '@/api/auth/auth.api';
import { clearAuth } from '@/app/redux-slice/authReducer';
import { getUserNotifications, markAllNotificationsAsRead } from '@/api/user/user.profile';
import type { Notification } from '@/types/response.types';
import { toast } from 'react-toastify';
import { toastifyOptionsCenter } from '@/utils/toastify.options';

const Header: React.FC<{ hideNavigation?: boolean }> = ({ hideNavigation = false }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setLoading] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const auth = useAppSelector((s) => s.authReducer.auth);
  const profileUrl = useAppSelector((s) => s.authReducer.profileUrl) || '/defaultProfile.jpg';
  const isPremium = useAppSelector((s) => s.authReducer.isPremium);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const closeAndOpenMenu = () => {
    setIsOpen((prev) => !prev);
  };
  const navigateTo = (path: string) => {
    if (isOpen) {
      closeAndOpenMenu();
    }
    navigate(path);
  };

  const userLogout = async () => {
    try {
      setLoading(true);
      const res = await logout();
      if (res && res.status === 204) {
        dispatch(clearAuth());
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await getUserNotifications();
        setNotifications(res.data.notifications);
      } catch (error) {
        console.log(error);
      }
    }
    fetchNotifications();
  }, []);

  const handleMarkAllNotificationsAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications([]);
      toast.success('All notifications marked as read', toastifyOptionsCenter);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -300 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 80, damping: 20 }}
      >
        <header className="w-full fixed min-h-20 md:h-30 flex justify-center items-center z-49">
          <nav className="md:border-1  bg-white md:border-gray-700 md:rounded-sm h-20 md:h-16  w-full md:w-[80%] flex items-center justify-between px-2 md:px-0 box-border">
            {/* left */}
            <div className="flex items-center">
              <div className="flex items-center h-full xl:pl-8 md:p-4 pt-1  ">
                <img
                  onClick={() => navigateTo('/')}
                  src="/logo.png"
                  alt="logo"
                  className="max-h-12 min-h-10 min-w-32 select-none cursor-pointer  "
                />
              </div>
              {!hideNavigation && (
                <div className="hidden md:block pl-10">
                  <ul className="flex xl:gap-9 md:gap-5 md:text-xs xl:text-sm text-gray-600 font-[anybody-regular] ">
                    {navHeads.map((head, index) => (
                      <li
                        key={index}
                        onClick={() => navigate(head.navigate)}
                        className="cursor-pointer select-none hover:text-black hover:scale-105 transition-all duration-400"
                      >
                        {head.title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="p-2 text-gray-600" onClick={closeAndOpenMenu}>
                {isOpen ? <X /> : <Menu />}
              </button>
            </div>

            {/* right - desktop only */}
            <div className="hidden md:flex flex-grow justify-end pr-8">
              {auth ? (
                <ul className="flex xl:gap-5 md:gap-3 items-center ">
                  {navIcons.map((icon, index) => (
                    <li className="cursor-pointer select-none relative" key={index}>
                      <div
                        className="hover:text-black hover:scale-105 transition-all duration-400 relative"
                        onClick={() => {
                          if (icon.navigate === '') {
                            setIsNotificationOpen(!isNotificationOpen);
                          } else {
                            navigate(icon.navigate);
                          }
                        }}
                      >
                        {icon.icon}
                        {icon.navigate === '' && notifications.some((n) => !n.isRead) && (
                          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        )}
                      </div>

                      {icon.navigate === '' && isNotificationOpen && (
                        <div className="absolute top-10 -right-2 w-[350px] bg-white border border-gray-100 shadow-2xl rounded-xl p-4 z-50 text-left cursor-default animate-in fade-in zoom-in duration-200">
                          <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-50">
                            <h3 className="font-semibold text-gray-800 tracking-tight">
                              Notifications
                            </h3>
                            <span
                              className="text-xs font-medium text-blue-600 cursor-pointer hover:text-blue-800"
                              onClick={handleMarkAllNotificationsAsRead}
                            >
                              Mark all as read
                            </span>
                          </div>
                          <div className="flex flex-col gap-4 h-[300px] overflow-y-auto pr-1">
                            {notifications.length > 0 ? (
                              notifications.map((n) => (
                                <div
                                  key={n._id}
                                  className={`flex gap-3 items-start group ${!n.isRead ? 'bg-blue-50/20 -mx-2 px-2 py-1 rounded-md' : ''}`}
                                >
                                  <div
                                    className={`w-9 h-9 rounded-full ${n.type === 'badge' ? 'bg-amber-50 group-hover:bg-amber-100' : 'bg-blue-50 group-hover:bg-blue-100'} flex items-center justify-center shrink-0 mt-0.5 transition-colors`}
                                  >
                                    {n.type === 'badge' ? (
                                      <Crown size={16} className="text-amber-500" />
                                    ) : (
                                      <Bell size={16} className="text-blue-600" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-800">{n.title}</p>
                                    <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                                      {n.message}
                                    </p>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-gray-500 text-center py-4">
                                No notifications yet.
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                  <li
                    className="cursor-pointer select-none hover:text-black hover:scale-105 transition-all duration-400 relative"
                    onClick={() => navigate('/user')}
                  >
                    <div className="relative">
                      <img
                        src={profileUrl}
                        alt="profile"
                        className={`rounded-full h-8 w-8 box-content object-cover ${
                          isPremium
                            ? 'border-2 border-amber-400'
                            : 'border-2 border-black p-[1.5px]'
                        }`}
                      />
                      {isPremium && (
                        <div className="absolute -bottom-1 -right-1 bg-amber-400 rounded-full p-[2px] border border-white">
                          <Crown size={8} className="text-white fill-white" />
                        </div>
                      )}
                    </div>
                  </li>
                  <li>
                    <Button
                      size="sm"
                      className="cursor-pointer"
                      onClick={userLogout}
                      disabled={isLoading}
                    >
                      {isLoading ? <LoaderCircle className="animate-spin" /> : 'Logout'}
                    </Button>
                  </li>
                </ul>
              ) : (
                <div className="flex">
                  <Button
                    variant="ghost"
                    size={'sm'}
                    className="cursor-pointer"
                    onClick={() => navigateTo('/access-login')}
                  >
                    Login
                  </Button>
                </div>
              )}
            </div>
          </nav>
        </header>
      </motion.div>
      {/* mobile view  */}
      {isOpen ? (
        <div
          className={`md:hidden fixed  flex flex-col gap-5  justify-center items-center inset-0 z-50  bg-white  transform transition-transform duration-300 ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          } `}
        >
          <div className="absolute top-7 right-5">
            <X onClick={closeAndOpenMenu} />
          </div>
          <ul className=" flex flex-col gap-4 text-xl text-center  font-[anybody-regular]">
            {navHeads.map((head) => (
              <li className="select-none "> {head.title}</li>
            ))}
          </ul>
          {auth ? (
            <ul className=" flex flex-row-reverse gap-6 text-xl text-center justify-center items-center font-[anybody-regular]">
              {navIcons.map((icon, index) => (
                <li key={index} className="relative cursor-pointer">
                  <div
                    onClick={() => {
                      if (icon.navigate === '') {
                        setIsNotificationOpen(!isNotificationOpen);
                      } else {
                        navigate(icon.navigate);
                        closeAndOpenMenu();
                      }
                    }}
                    className="relative"
                  >
                    {icon.icon}
                    {icon.navigate === '' && notifications.some((n) => !n.isRead) && (
                      <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    )}
                  </div>
                  {icon.navigate === '' && isNotificationOpen && (
                    <div className="absolute top-10 right-0 w-[280px] bg-white border border-gray-100 shadow-2xl rounded-xl p-4 z-[60] text-left cursor-default text-sm">
                      <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-50">
                        <h3 className="font-semibold text-gray-800">Notifications</h3>
                      </div>
                      <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((n) => (
                            <div
                              key={n._id}
                              className={`flex gap-3 items-start ${!n.isRead ? 'bg-blue-50/20 -mx-2 px-2 py-1 rounded-md' : ''}`}
                            >
                              <div
                                className={`w-8 h-8 rounded-full ${n.type === 'badge' ? 'bg-amber-50' : 'bg-blue-50'} flex items-center justify-center shrink-0`}
                              >
                                {n.type === 'badge' ? (
                                  <Crown size={14} className="text-amber-500" />
                                ) : (
                                  <Bell size={14} className="text-blue-600" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-800">{n.title}</p>
                                <p className="text-xs text-gray-600 mt-0.5">{n.message}</p>
                                <p className="text-[10px] text-gray-400 mt-1">
                                  {new Date(n.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500 text-center py-4">
                            No notifications yet.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </li>
              ))}
              <li className="relative">
                <div className="relative">
                  <img
                    src={profileUrl}
                    alt="profile"
                    className={`rounded-full h-7 box-content ${
                      isPremium ? 'border-2 border-amber-400' : 'border-2 border-black p-[1.5px]'
                    }`}
                  />
                  {isPremium && (
                    <div className="absolute -bottom-1 -right-1 bg-amber-400 rounded-full p-[2px] border border-white">
                      <Crown size={8} className="text-white fill-white" />
                    </div>
                  )}
                </div>
              </li>
            </ul>
          ) : (
            <div className="flex gap-4">
              <Button
                variant="outline"
                size={'sm'}
                className="w-20"
                onClick={() => navigateTo('/access-login')}
              >
                Login
              </Button>
            </div>
          )}
        </div>
      ) : null}
    </>
  );
};

export default Header;
