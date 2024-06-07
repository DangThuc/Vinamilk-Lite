import { useState, useEffect, useRef } from 'react';
import { AccountLayout } from '../../components/layout';
import { Tab, Input, Button, Loading } from '../../components/common';
import DefaultAvatar from '../../assets/images/default-avatar.jpg';
import { useAuth } from '../../hooks';
import Swal from 'sweetalert2';
import { firebaseApi } from '../../api';
import eye from '../../assets/images/eye-solid.svg';
import eyeslash from '../../assets/images/eye-slash-solid.svg';

function ProfilePage() {
  const [activeTab, setActiveTab] = useState(0);
  const { profile, updateProfile, changePassword } = useAuth();
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [disabled1, setDisabled1] = useState(true);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [loading, setLoading] = useState(false);
  const eyeiconRef = useRef(null);
  const eyeicon1Ref = useRef(null);
  const eyeicon2Ref = useRef(null);
  const currentPasswordRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [disabled2, setDisabled2] = useState(true);

  const handleAvatarChange = (event) => {
    if (!event.target.files || event.target.files.length === 0) {
      setFile(undefined);
      return;
    }

    setFile(event.target.files[0]);
    setPreviewUrl(URL.createObjectURL(event.target.files[0]));
  };

  const handleDeleteAvatar = async () => {
    if (!imageUrl && !previewUrl) {
      Swal.fire({
        title: 'Không có ảnh!',
        text: 'Bạn chưa có ảnh đại diện và cũng chưa tải ảnh nào lên!',
        icon: 'warning',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Xóa ảnh đại diện?',
      text: 'Ảnh chỉ bị xóa tạm thời trừ khi bạn lưu thay đổi!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0213AF',
      cancelButtonColor: 'rgb(185,28,28)',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    });
    if (result.isConfirmed) {
      setFile(null);
      setPreviewUrl('');
      setImageUrl('');
      Swal.fire({
        title: 'Đã xóa',
        icon: 'success',
      });
    }
  };

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
    const firstName = event.target.value.trim();
    const alphaRegex =
      /^[a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêếìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/;
    if (firstName === '') {
      setFirstNameError('Tên bắt buộc!');
      return;
    }
    if (firstName.length < 2 || firstName.length > 50) {
      setFirstNameError('Tên phải có độ dài từ 2 đến 30 ký tự!');
      return;
    }
    if (!alphaRegex.test(firstName)) {
      setFirstNameError('Tên không được chứa số hoặc ký tự đặc biệt!');
      return;
    }
    setFirstNameError('');
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
    const lastName = event.target.value.trim();
    const alphaRegex =
      /^[a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêếìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/;
    if (lastName === '') {
      setLastNameError('Họ bắt buộc!');
      return;
    }
    if (lastName.length < 2 || lastName.length > 50) {
      setLastNameError('Họ phải có độ dài từ 2 đến 30 ký tự!');
      return;
    }
    if (!alphaRegex.test(lastName)) {
      setLastNameError('Họ không được chứa số hoặc ký tự đặc biệt!');
      return;
    }
    setLastNameError('');
  };

  const handleUpdateProfile = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      let avatar = null;
      if (file) {
        const url = await firebaseApi.upload(file, `users/${Date.now()}_${file.name}`);
        avatar = url;
      }
      await updateProfile({
        avatar,
        first_name: firstName,
        last_name: lastName,
      });
      setLoading(false);
      Swal.fire({
        icon: 'success',
        title: 'Cập nhật thông tin cá nhân thành công!',
      });
    } catch (error) {
      setLoading(false);
      const errorMessage =
        error.response?.data?.message || error.message || 'Something went wrong!';
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
      });
    }
  };

  const changeCurrentPasswordType = () => {
    if (currentPasswordRef) {
      if (currentPasswordRef.current.type == 'password') {
        currentPasswordRef.current.type = 'text';
        if (eyeiconRef) {
          eyeiconRef.current.src = eye;
        }
      } else {
        currentPasswordRef.current.type = 'password';
        if (eyeiconRef) {
          eyeiconRef.current.src = eyeslash;
        }
      }
    }
  };

  const changePasswordType = () => {
    if (passwordRef) {
      if (passwordRef.current.type == 'password') {
        passwordRef.current.type = 'text';
        if (eyeicon1Ref) {
          eyeicon1Ref.current.src = eye;
        }
      } else {
        passwordRef.current.type = 'password';
        if (eyeicon1Ref) {
          eyeicon1Ref.current.src = eyeslash;
        }
      }
    }
  };

  const changeConfirmPasswordType = () => {
    if (confirmPasswordRef) {
      if (confirmPasswordRef.current.type == 'password') {
        confirmPasswordRef.current.type = 'text';
        if (eyeicon2Ref) {
          eyeicon2Ref.current.src = eye;
        }
      } else {
        confirmPasswordRef.current.type = 'password';
        if (eyeicon2Ref) {
          eyeicon2Ref.current.src = eyeslash;
        }
      }
    }
  };

  const handleCurrentPasswordChange = (event) => {
    setCurrentPassword(event.target.value);
    const currentPassword = event.target.value;
    if (currentPassword === '') {
      setCurrentPasswordError('Mật khẩu hiện tại là bắt buộc!');
      return;
    }
    setCurrentPasswordError('');
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    const password = event.target.value;
    if (password === '') {
      setPasswordError('Mật khẩu mới là bắt buộc!');
      return;
    }
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError(
        'Mật khẩu phải có ít nhất 8 ký tự, có ít nhất 1 chữ cái viết hoa, 1 chữ cái viết thường, 1 số và 1 ký tự đặc biệt!'
      );
      return;
    }
    if (password.length > 20) {
      setPasswordError('Mật khẩu có tối đa 20 ký tự!');
      return;
    }
    setPasswordError('');
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
    const confirmPassword = event.target.value;
    if (confirmPassword === '') {
      setConfirmPasswordError('Mật khẩu xác nhận là bắt buộc!');
      return;
    }
    if (confirmPassword !== password) {
      setConfirmPasswordError('Mật khẩu nhập lại không khớp!');
      return;
    }
    setConfirmPasswordError('');
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await changePassword({
        current_password: currentPassword,
        password,
      });
      setLoading(false);
      Swal.fire({
        icon: 'success',
        title: 'Đổi mật khẩu thành công!',
      });
    } catch (error) {
      setLoading(false);
      const errorMessage =
        error.response?.data?.message || error.message || 'Something went wrong!';
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
      });
    }
  };

  useEffect(() => {
    setImageUrl(profile?.avatar || '');
    setEmail(profile.email || '');
    setFirstName(profile.first_name);
    setLastName(profile.last_name);
  }, [profile]);

  useEffect(() => {
    if (firstNameError || lastNameError) {
      setDisabled1(true);
      return;
    }
    if (previewUrl || imageUrl !== profile.avatar) {
      setDisabled1(false);
      return;
    }
    if (profile.first_name !== firstName.trim()) {
      setDisabled1(false);
      return;
    }
    if (profile.last_name !== lastName.trim()) {
      setDisabled1(false);
      return;
    }
    setDisabled1(true);
  }, [previewUrl, firstName, lastName]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    if (!mounted) {
      setDisabled2(true);
      setMounted(true);
      return;
    }
    if (currentPasswordError || passwordError || confirmPasswordError) {
      setDisabled2(true);
    } else {
      setDisabled2(false);
    }
  }, [currentPasswordError, passwordError, confirmPasswordError]);

  return (
    <AccountLayout>
      <div className="text-primary">
        <h3 className="py-2 font-vs-std font-semibold text-[2rem] sm:text-[1.7rem] border-b border-primary">
          Hồ sơ cá nhân
        </h3>
        <div className="flex space-x-3 my-6">
          <Tab
            title="Thông tin của tôi"
            isActive={activeTab === 0}
            handleClick={() => setActiveTab(0)}
          />
          <Tab
            title="Thay đổi mật khẩu"
            isActive={activeTab === 1}
            handleClick={() => setActiveTab(1)}
          />
        </div>
        <div>
          {activeTab === 0 && (
            <form action="">
              <div className="flex space-x-4 items-center mb-[24px]">
                <img
                  className="w-[120px] rounded-full aspect-square"
                  src={previewUrl || imageUrl || DefaultAvatar}
                  alt="Ảnh đại diện"
                />
                <label htmlFor="changeAvatar" className="cursor-pointer hover:underline">
                  Thay đổi
                </label>
                <input
                  onChange={handleAvatarChange}
                  id="changeAvatar"
                  accept="image/*"
                  hidden
                  type="file"
                />
                <button
                  onClick={handleDeleteAvatar}
                  type="button"
                  className="text-red-700 hover:underline"
                >
                  Xóa
                </button>
              </div>
              <div className="relative flex flex-col justify-center mb-[24px]">
                <label
                  className="transition-all font-vs-std text-[16px] text-[rgb(153,153,153)] italic mb-[8px] flex font-[450] leading-[19px]"
                  htmlFor="email"
                >
                  Email
                </label>
                <div className="relative">
                  <Input id="email" type="text" isDisable value={email} />
                </div>
              </div>
              <div className="flex space-x-4 items-center mb-[24px]">
                <div className="flex-1">
                  <label
                    className="transition-all font-vs-std text-[16px] text-primary italic mb-[8px] flex font-[450] leading-[19px]"
                    htmlFor="lastName"
                  >
                    Họ và tên đệm
                  </label>
                  <div className="relative">
                    <Input
                      handleChange={handleLastNameChange}
                      id="lastName"
                      type="text"
                      value={lastName}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label
                    className="transition-all font-vs-std text-[16px] text-primary italic mb-[8px] flex font-[450] leading-[19px]"
                    htmlFor="fistName"
                  >
                    Tên
                  </label>
                  <div className="relative">
                    <Input
                      handleChange={handleFirstNameChange}
                      id="fistName"
                      type="text"
                      value={firstName}
                    />
                  </div>
                </div>
              </div>
              {firstNameError && <p className="text-red-600 mt-1 font-inter">{firstNameError}</p>}
              {lastNameError && <p className="text-red-600 mt-1 font-inter">{lastNameError}</p>}
              <div className="w-[240px] mt-[32px] md:w-full">
                <Button
                  title="Lưu thay đổi"
                  type="submit"
                  isDisable={disabled1}
                  handleClick={handleUpdateProfile}
                />
              </div>
            </form>
          )}
          {activeTab === 1 && (
            <div>
              <form action="">
                <div className="relative flex flex-col justify-center mb-[24px]">
                  <label
                    className="transition-all font-vs-std text-[16px] text-vinamilk-blue italic mb-[8px] flex font-[450] leading-[19px]"
                    htmlFor="password"
                  >
                    Mật khẩu hiện tại*
                  </label>
                  <div className="inline-block">
                    <Input
                      type="password"
                      value={currentPassword}
                      placeholder="Nhập mật khẩu hiện tại*"
                      handleChange={handleCurrentPasswordChange}
                      id="password"
                      ref={currentPasswordRef}
                    />
                    <div className="h-auto w-[24px] cursor-pointer absolute top-10 right-2">
                      <img
                        ref={eyeiconRef}
                        src={eyeslash}
                        alt="()"
                        onClick={changeCurrentPasswordType}
                      />
                    </div>
                    {currentPasswordError && (
                      <p className="text-red-600 mt-1 font-inter">{currentPasswordError}</p>
                    )}
                  </div>
                </div>
                <div className="relative flex flex-col justify-center mb-[24px]">
                  <label
                    className="transition-all font-vs-std text-[16px] text-vinamilk-blue italic mb-[8px] flex font-[450] leading-[19px]"
                    htmlFor="password"
                  >
                    Mật khẩu mới*
                  </label>
                  <div className="inline-block">
                    <Input
                      type="password"
                      value={password}
                      placeholder="Nhập mật khẩu mới*"
                      handleChange={handlePasswordChange}
                      id="password"
                      ref={passwordRef}
                    />
                    <div className="h-auto w-[24px] cursor-pointer absolute top-10 right-2">
                      <img ref={eyeicon1Ref} src={eyeslash} alt="()" onClick={changePasswordType} />
                    </div>
                    {passwordError && (
                      <p className="text-red-600 mt-1 font-inter">{passwordError}</p>
                    )}
                  </div>
                </div>
                <div className="relative flex flex-col justify-center mb-[24px]">
                  <label
                    className="transition-all font-vs-std text-[16px] text-vinamilk-blue italic mb-[8px] flex font-[450] leading-[19px]"
                    htmlFor="password"
                  >
                    Xác nhận mật khẩu mới*
                  </label>
                  <div className="inline-block">
                    <Input
                      type="password"
                      value={confirmPassword}
                      placeholder="Nhập lại mật khẩu phía trên*"
                      handleChange={handleConfirmPasswordChange}
                      id="password"
                      ref={confirmPasswordRef}
                    />
                    <div className="h-auto w-[24px] cursor-pointer absolute top-10 right-2">
                      <img
                        ref={eyeicon2Ref}
                        src={eyeslash}
                        alt="()"
                        onClick={changeConfirmPasswordType}
                      />
                    </div>
                    {confirmPasswordError && (
                      <p className="text-red-600 mt-1 font-inter">{confirmPasswordError}</p>
                    )}
                  </div>
                </div>
                <div className="w-[200px] mt-[32px] md:w-full">
                  <Button
                    title="Xác nhận"
                    type="submit"
                    isDisable={disabled2}
                    handleClick={handleChangePassword}
                  />
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
      {loading && <Loading fullScreen />}
    </AccountLayout>
  );
}

export default ProfilePage;
