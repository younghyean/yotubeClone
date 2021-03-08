import Axios from 'axios';
import React, {useState} from 'react';
import  { useSelector } from 'react-redux';
import SingleComment from './SingleComment';


function Comment(props) {

    const videoId = props.videoId;

    const user = useSelector(state => state.user);
    const [CommentValue, setCommentValue] = useState("");

    const handleClick = (event) => {
        setCommentValue(event.currentTarget.value)
    }
    const onSubmit = (event) => {
        event.preventDefault();

        const variables = {
            content: CommentValue,
            writer: user.userData._id,
            postId : videoId,

        }
        Axios.post('/api/comment/saveComment',variables)
        .then(response => {
            if(response.data.success){
                    console.log(response.data.result);
                    setCommentValue("");
                    props.refreshFunction(response.data.result);
            }else{
                alert("커멘트 저장 실패");
            }
        })
    }

    return (
        <div>
            <br />
            <p> Replies</p>
            <br />
            {props.commentLists && props.commentLists.map((comment, index)=> (
                (!comment.responseTo &&
                <SingleComment refreshFunction={props.refreshFunction} comment={comment} postId={videoId} />
                )
            ))}
           
            <form style = {{ display : 'flex'}} onSubmit={onSubmit}>
                <textarea
                    style = {{ width : '100%', borderRadius : '5px' }}
                    onChange={handleClick}
                    value={CommentValue}
                    placeholder = "코멘트를 작성해 주세요"
                />
                <br />
                <button style = {{ width : '20%' , height : '52px' }} onClick={onSubmit} >Submit</button>
            </form>
        </div>
    )
}

export default Comment
