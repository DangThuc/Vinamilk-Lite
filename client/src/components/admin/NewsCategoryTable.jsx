import PropTypes from 'prop-types';
import EllipsisIcon from '../../assets/images/ellipsis.svg';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { newsCategoryApi } from '../../api';
import { Button, Input, Loading } from '../admin';
import { Overlay } from '../../components/common';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CloseIcon from '../../assets/images/close-dark.svg';

function NewsCategoryTable({ categoryRows, handleMutate }) {
  const [loading, setLoading] = useState(false);
  const [actionsExpandedId, setActionsExpandedId] = useState(null);
  const [categoryEdit, setCategoryEdit] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: '',
      slug: '',
      order: '',
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required('Tên là bắt buộc').max(255, 'Tên có nhiều nhất 255 ký tự'),
      slug: Yup.string()
        .required('Slug là bắt buộc')
        .matches(/^[a-zA-Z0-9-]+$/, 'Slug chỉ bao gồm các ký tự a-z, A-Z, 0-9 và dấu gạch ngang')
        .max(255, 'Slug có nhiều nhất 255 ký tự'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const data = {
          name: values.name.trim(),
          slug: values.slug.trim(),
        };
        await newsCategoryApi.update(categoryEdit.id, data);
        setLoading(false);
        handleMutate();
        Swal.fire({
          icon: 'success',
          title: 'Sửa danh mục thành công!',
        });
      } catch (error) {
        setLoading(false);
        const errorMessage = error.response?.data?.message || 'Something went wrong!';
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: errorMessage,
        });
      }
    },
    onReset: () => {
      formik.setValues(formik.initialValues);
    },
  });

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa danh mục này',
      text: 'Bạn sẽ không thể hoàn tác lại',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ok, xóa đi',
      cancelButtonText: 'Hủy',
    });
    if (result.isConfirmed) {
      setLoading(true);
      try {
        await newsCategoryApi.delete(id);
        handleMutate();
        setActionsExpandedId(null);
        setLoading(false);
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
        });
      } catch (error) {
        setLoading(false);
        const errorMessage = error.response?.data?.message || 'Something went wrong!';
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: errorMessage,
        });
      }
    }
  };

  useEffect(() => {
    if (!categoryEdit) return;

    formik.setValues({
      name: categoryEdit.name || '',
      slug: categoryEdit.slug || '',
    });
  }, [categoryEdit]);

  return (
    <>
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">ID</th>
            <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">Tên</th>
            <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">Slug</th>
            <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">Thứ tự</th>
            <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">Ngày tạo</th>
            <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">
              Ngày cập nhật
            </th>
            <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {categoryRows.map((category) => (
            <tr key={category.id}>
              <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100">{category.id}</td>
              <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100 whitespace-nowrap">
                {category.name}
              </td>
              <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100 whitespace-nowrap">
                {category.slug}
              </td>
              <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100">
                {category.cate_order}
              </td>
              <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100 whitespace-nowrap">
                {category.created_at}
              </td>
              <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100 whitespace-nowrap">
                {category.updated_at}
              </td>
              <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100">
                <div className="h-full relative flex justify-center items-center">
                  <div
                    onClick={() =>
                      setActionsExpandedId((id) => (category.id === id ? null : category.id))
                    }
                    className="p-2 cursor-pointer"
                  >
                    <img className="w-4 h-4" src={EllipsisIcon} alt="..." />
                  </div>
                  {actionsExpandedId === category.id && (
                    <div className="absolute z-[1] bottom-0 -translate-x-full left-0 min-w-[80px] rounded-md shadow-md bg-secondary py-2">
                      <ul className="overflow-y-auto">
                        <li>
                          <button
                            onClick={() => setCategoryEdit(category)}
                            className="w-full text-left text-[13px] py-1 px-3 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                          >
                            Sửa
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleDelete(category.id)}
                            className="w-full text-left text-[13px] py-1 px-3 text-gray-600 hover:text-red-500 hover:bg-gray-50"
                          >
                            Xóa
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {categoryEdit && (
        <Overlay handleClickOut={() => setCategoryEdit(null)}>
          <div className="ml-auto bg-secondary min-h-full w-[600px] max-w-full p-6 md:p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-2xl font-semibold">Sửa danh mục</h4>
              <img
                onClick={() => setCategoryEdit(null)}
                className="cursor-pointer w-5 h-5 object-cover"
                src={CloseIcon}
                alt="X"
              />
            </div>
            <form
              method="post"
              action=""
              onSubmit={formik.handleSubmit}
              onReset={formik.handleReset}
            >
              <div className="mt-4">
                <label className="block text-gray-700 font-medium mb-2">Tên danh mục*</label>
                <Input
                  placeholder="Nhập tên danh mục*"
                  value={formik.values.name}
                  handleChange={formik.handleChange}
                  type="text"
                  name="name"
                />
                {formik.errors.name && formik.touched.name && (
                  <p className="text-red-600 mt-1 font-inter">{formik.errors.name}</p>
                )}
              </div>
              <div className="mt-4">
                <label className="block text-gray-700 font-medium mb-2">Slug*</label>
                <Input
                  placeholder="Nhập slug của danh mục*"
                  value={formik.values.slug}
                  handleChange={formik.handleChange}
                  type="text"
                  name="slug"
                />
                {formik.errors.slug && formik.touched.slug && (
                  <p className="text-red-600 mt-1 font-inter">{formik.errors.slug}</p>
                )}
              </div>
              <div className="mt-6 flex space-x-2">
                <div className="flex-1">
                  <Button title="Reset" type="reset" />
                </div>
                <div className="flex-1">
                  <Button title="Xác nhận" type="submit" />
                </div>
              </div>
            </form>
          </div>
        </Overlay>
      )}
      {loading && <Loading fullScreen />}
    </>
  );
}

NewsCategoryTable.propTypes = {
  categoryRows: PropTypes.array.isRequired,
  handleMutate: PropTypes.func.isRequired,
};

export default NewsCategoryTable;
