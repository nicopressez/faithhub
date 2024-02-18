import { PropTypes } from "prop-types";
import { useEffect, useState } from "react";

const TopComments = ({ postid }) => {

    const [comments, setComments] = useState()

    useEffect(() => {
        const fetchTopComments = async() => {
          try{
            const response = await fetch(`https://faithhub-backend.fly.dev/post/${postid}/topcomments`)
            const data = await response.json()
            setComments(data.comments)
            console.log(data)
          } catch(err) {
            console.log(err)
          }
        }
        fetchTopComments()
    },[postid])
    
 return (
    <div>comments</div>
 )   
}

TopComments.propTypes = {
    postid: PropTypes.string,
}

export default TopComments