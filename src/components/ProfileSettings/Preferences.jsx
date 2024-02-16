import { useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import Loading from "../Loading";
import { tokenRefresh } from "../../reducers/auth";

const Preferences = () => {

    const [updated, setUpdated] = useState(false)
    const [submitToggle, setSubmitToggle] = useState(false)

    const auth = useSelector((state) => state.auth)
    const dispatch = useDispatch()

    const { user } = auth;

    const handleCheckAll = (e) => {
        e.preventDefault();
        const form = e.target.form
        for (let i = 0; i < form.elements.length; i++) {
         const element = form.elements[i]
         if (element.type === 'checkbox'){
                 element.checked = true;
             }
        }
    }

    const handleClearAll = (e) => {
        e.preventDefault()
        const form = e.target.form
        for (let i = 0; i < form.elements.length; i++) {
         const element = form.elements[i]
         if (element.type === 'checkbox'){
                 element.checked = false;
             }
        }
    }

    const checkChange = (e) => {
        // If the current form is different from initial one, toggle
        // submit button
        const form = e.target.form
       for (let i = 0; i < form.elements.length; i++) {
        const element = form.elements[i]
        if (element.defaultChecked !== element.checked){
            setSubmitToggle(true);
            return;
        }
        setSubmitToggle(false)
       }
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        setUpdated(false)
        const preferences = [];
        const token = localStorage.getItem("token")
        // Iterate through form and populate preferences
        Array.prototype.forEach.call(e.target.elements, (element) => {
            if (element.checked) {
                preferences.push(element.name)
            }
        })
        try {
            const response = await fetch(`https://faithhub-backend.fly.dev/profile/${user._id}/preferences`,{
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(preferences),
            })
            const result = await response.json()
            // Update token and user info
            localStorage.setItem("token", result.token)
            dispatch(tokenRefresh(result.user))
            setUpdated(true);
        } catch(err) {
            // TODO: Add error handling
            console.log(err)
        }
    }

    if (user) return (
        <div className="bg-gray-100 w-screen h-screen pt-[0.5rem]">
        <div
          className=" 
        ml-auto mr-auto mt-[22%] md:mt-20 bg-white md:w-2/4
         rounded-lg drop-shadow-md p-1 pb-3 md:pb-5 md:p-3 md:pl-10 md:pr-10 font-Rubik "
         >
            <h2 className="text-2xl font-bold text-center"> Preferences </h2>
            <hr className="w-3/4 ml-auto mr-auto mb-3"></hr>
            <p className="text-center mb-2 italic text-sm">
            Customize your feed with posts tailored to your interests.
            <br></br>
            </p>
            <form onSubmit={handleSubmit} 
            onChange={checkChange}
            className="flex flex-col">
                {updated && 
                <h3 className="text-center text-cyan-500 text-lg"
                >Preferences updated successfully!</h3>}
                <div className="grid grid-cols-2">

                 <div className=" flex flex-col justify-center text-sm md:text-base ml-[10%] md:ml-[30%] 
                  font-bold gap-2 md:gap-1">
                  <label htmlFor="prayer">Prayer requests</label>
                  <label htmlFor="discussion">Community discussions</label>
                  <label htmlFor="testimony">Testimonies</label>
                 </div>

                 <div className=" flex flex-col gap-5 md:gap-3 justify-center ml-[80%] md:ml-[68%]">
                   <input type="checkbox" id="prayer"
                     name="Prayer Request" 
                     className=" w-4 h-4  accent-cyan-400"
                     defaultChecked={
                        user.preferences.find((pref) => pref === "Prayer Request") 
                        ? true
                        : false
                     }/>
                   <input type="checkbox" id="discussion"
                     name="Discussion"
                     className=" w-4 h-4 accent-cyan-400"
                     defaultChecked={
                        user.preferences.find((pref) => pref === "Discussion") 
                        ? true
                        : false
                     } />
                   <input type="checkbox" id="testimony"
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
                <button type="button" 
                onClick={(e) => {handleClearAll(e); checkChange(e)}}
                className=" bg-gray-400 text-white w-1/4 rounded-md">
                    Clear all</button>
                <button type="button" 
                onClick={(e) => {handleCheckAll(e); checkChange(e)}}
                className=" bg-gray-400 text-white w-1/4 rounded-md">
                    Check all</button>
                </div>

                <hr className="w-3/4 ml-auto mr-auto mt-3"></hr>

                {submitToggle &&
                    <input type="submit" value="Confirm"
                    className=" bg-cyan-400 text-white
        p-1 pl-6 pr-6 rounded-md text-xl mt-3 block ml-auto mr-auto hover:cursor-pointer"/>}
            </form>


         </div>
     </div>
    )

    return (
        <Loading />
      )
}

export default Preferences