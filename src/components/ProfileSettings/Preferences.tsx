import React,{ useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../reducers/hooks";
import { tokenRefresh } from "../../reducers/auth";
import { useOutletContext } from "react-router-dom";
import { Transition } from "@headlessui/react";
import { OutletContextType } from "../Main/MainPage";

const Preferences = () => {
  const [updated, setUpdated] = useState(false);
  const [submitToggle, setSubmitToggle] = useState(false);

  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { user } = auth;

  const outletContext = useOutletContext<OutletContextType>();
  const { navVisible, isLargeDevice } = outletContext;

  const formRef = useRef<HTMLFormElement>(null)

  const handleCheckAll = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (formRef.current){
      for (let i = 0; i < formRef.current.elements.length; i++) {
      const element = formRef.current.elements[i] as HTMLInputElement;
      if (element.type === "checkbox") {
        element.checked = true;
      }
    }
  }
  };

  const handleClearAll = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (formRef.current){
      for (let i = 0; i < formRef.current.elements.length; i++) {
      const element = formRef.current.elements[i] as HTMLInputElement;
      if (element.type === "checkbox") {
        element.checked = false;
      }
    }
  }
  };

  const checkChange = 
  (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    // If the current form is different from initial one, toggle
    // submit button
    if(formRef.current){
    for (let i = 0; i < formRef.current.elements.length; i++) {
      const element = formRef.current.elements[i] as HTMLInputElement;
      if (element.defaultChecked !== element.checked) {
        setSubmitToggle(true);
        return;
      }
      setSubmitToggle(false);
    }
  }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    setUpdated(false);
    const preferences: string[] = [];
    const token = localStorage.getItem("token");
    const form = e.currentTarget;
    // Iterate through form and populate preferences
    Array.from(form.elements).forEach((element: HTMLInputElement) => {
      if (element.type === "checkbox" && element.checked) {
        preferences.push(element.name);
      }
    });
    try {
      const response = await fetch(
        `https://faithhub-backend.fly.dev/profile/${user._id}/preferences`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(preferences),
        },
      );
      const result = await response.json();
      // Update token and user info
      localStorage.setItem("token", result.token);
      dispatch(tokenRefresh(result.user));
      setUpdated(true);
    } catch (err) {
      // TODO: Add error handling
      console.log(err);
    }
  };

  if (user)
    return (
      <div
        className={`bg-gray-100 w-screen h-screen pt-[0.5rem] pl-2 pr-2 md:pl-5 md:pr-5
        ${navVisible && !isLargeDevice ? "brightness-75 blur-sm" : null}`}
      >
        <Transition
          show={true}
          appear={true}
          enter="transition duration-300"
          enterFrom="opacity-0 transform -translate-y-10"
          enterTo="opacity-100 transform translate-y-0"
        >
          <div
            className=" 
        ml-auto mr-auto mt-[16%] md:mt-[10%] lg:mt-20 bg-white lg:w-[55%]
         rounded-lg drop-shadow-md p-1 pb-3 lg:pb-5 lg:p-3 lg:pl-10 lg:pr-10 font-Rubik "
          >
            <h2 className="text-2xl font-bold text-center"> Preferences </h2>
            <hr className="w-3/4 ml-auto mr-auto mb-3"></hr>
            <p className="text-center mb-2 italic text-sm">
              Customize your feed with posts tailored to your interests.
              <br></br>
            </p>
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              onChange={checkChange}
              className="flex flex-col"
            >
              {updated && (
                <h3 className="text-center text-cyan-500 text-lg">
                  Preferences updated successfully!
                </h3>
              )}
              <div className="grid grid-cols-2">
                <div
                  className=" flex flex-col justify-center text-sm md:text-base ml-[10%] lg:ml-[30%] 
                  font-bold gap-2 lg:gap-1"
                >
                  <label htmlFor="prayer">Prayer requests</label>
                  <label htmlFor="discussion">Community discussions</label>
                  <label htmlFor="testimony">Testimonies</label>
                </div>

                <div className=" flex flex-col gap-5 lg:gap-3 justify-center ml-[80%] lg:ml-[68%]">
                  <input
                    type="checkbox"
                    id="prayer"
                    name="Prayer Request"
                    className=" w-4 h-4  accent-cyan-400"
                    defaultChecked={
                      user.preferences.find((pref) => pref === "Prayer Request")
                        ? true
                        : false
                    }
                  />
                  <input
                    type="checkbox"
                    id="discussion"
                    name="Discussion"
                    className=" w-4 h-4 accent-cyan-400"
                    defaultChecked={
                      user.preferences.find((pref) => pref === "Discussion")
                        ? true
                        : false
                    }
                  />
                  <input
                    type="checkbox"
                    id="testimony"
                    name="Testimony"
                    className=" w-4 h-4 accent-cyan-400 "
                    defaultChecked={
                      user.preferences.find((pref) => pref === "Testimony")
                        ? true
                        : false
                    }
                  />
                </div>
              </div>

              <div className="flex flex-row justify-center gap-4 mt-3">
                <button
                  type="button"
                  onClick={(e) => {
                    handleClearAll(e);
                    checkChange(e);
                  }}
                  className=" bg-gray-400 text-white w-1/4 rounded-md"
                >
                  Clear all
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    handleCheckAll(e);
                    checkChange(e);
                  }}
                  className=" bg-gray-400 text-white w-1/4 rounded-md"
                >
                  Check all
                </button>
              </div>

              <hr className="w-3/4 ml-auto mr-auto mt-3"></hr>

              {submitToggle && (
                <Transition
                  show={true}
                  appear={true}
                  enter="transition duration-200"
                  enterFrom="transform scale-y-0 origin-top opacity-0"
                  enterTo="transform scale-y-100 origin-top opacity-100"
                  leave="transition duration-200"
                  leaveFrom="transform scale-y-100 origin-top opacity-100"
                  leaveTo="transform scale-y-0 origin-top opacity-0"
                >
                  <input
                    type="submit"
                    value="Confirm"
                    className=" bg-cyan-400 text-white
        p-1 pl-6 pr-6 rounded-md text-xl mt-3 block ml-auto mr-auto hover:cursor-pointer"
                  />
                </Transition>
              )}
            </form>
          </div>
        </Transition>
      </div>
    );
};

export default Preferences;
