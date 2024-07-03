import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
const DoctorRequestAccept = ({ open, closeModal }) => {
    
   

    const showAlert = async () => {
         if (type === 10) {
            Swal.fire({
                icon: 'warning',
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                showCancelButton: true,
                confirmButtonText: 'Delete',
                padding: '2em',
                customClass: 'sweet-alerts',
            }).then((result) => {
                if (result.value) {
                    Swal.fire({ title: 'Deleted!', text: 'Your file has been deleted.', icon: 'success', customClass: 'sweet-alerts' });
                }
            });
        
        }
    };
  return (
    <Transition appear show={open} as={Fragment}>
     <Dialog
        as="div"
        open={open}
        onClose={closeModal}
        className="relative z-[51]"
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-[black]/60" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center px-4 py-8">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"

            >
              <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-3xl text-black dark:text-white-dark">
              <div className="panel">
                        
                        <div className="mb-5">
                            <div className="flex items-center justify-center">
                                <button type="button" className="btn btn-success">
                                    Ok
                                </button>
                            </div>
                        </div>
                       
                          
                        
                    </div>
             
               
               
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default DoctorRequestAccept;
