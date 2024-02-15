import { useSelector } from "react-redux"

const Preferences = () => {

    const auth = useSelector((state) => state.auth)

    const { user } = auth;

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(user)
    }

    if (user) return (
        <div className="bg-gray-100 w-screen h-screen pt-[0.5rem]">
        <div
          className=" 
        ml-auto mr-auto mt-8 md:mt-20 bg-white md:w-2/4
         rounded-lg drop-shadow-md p-1 pb-8 md:p-3 md:pl-10 md:pr-10 font-Rubik "
         >
            <h2 className="text-2xl font-bold text-center"> Preferences </h2>
            <hr className="w-3/4 ml-auto mr-auto mb-3"></hr>
            <p className="text-center mb-2 italic">
            Customize your feed with posts tailored to your interests.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col">
                <div className="grid grid-cols-2">

                 <div className=" flex flex-col justify-center ml-[30%]">
                  <label htmlFor="prayer">Prayer requests</label>
                  <label htmlFor="discussion">Community discussions</label>
                  <label htmlFor="testimony">Testimonies</label>
                 </div>

                 <div className=" flex flex-col gap-3 justify-center ml-[40%]">
                   <input type="checkbox" id="prayer"
                     name="Prayer Request" 
                     defaultChecked={
                        user.preferences.find((pref) => pref === "Prayer Request") 
                        ? true
                        : false
                     }/>
                   <input type="checkbox" id="discussion"
                     name="Discussion"
                     defaultChecked={
                        user.preferences.find((pref) => pref === "Discussion") 
                        ? true
                        : false
                     } />
                   <input type="checkbox" id="testimony"
                     name="Testimony"
                     defaultChecked={
                        user.preferences.find((pref) => pref === "Testimony") 
                        ? true
                        : false
                     }
                     />
                 </div>

                </div>

                <input type="submit" value="Confirm"/>
            </form>
            <hr className="w-3/4 ml-auto mr-auto mb-3"></hr>

         </div>
     </div>
    )
}

export default Preferences