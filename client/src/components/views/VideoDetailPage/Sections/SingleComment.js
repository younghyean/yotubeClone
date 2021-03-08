import React from 'react';
import Axios from 'axios';
import  { useSelector } from 'react-redux';
import { Comment, Avatar, Button, Input} from 'antd';
import { useState } from 'react';

const { TextArea } = Input;
function SingleComment(props) {
    const videoId = props.videoId;

    const user = useSelector(state => state.user);
    const  [OpenReply, setOpenReply] = useState(false);
    const  [CommentValue, setCommentValue] = useState("");
    const onClickReplyOpen= () => {
        setOpenReply(!OpenReply);
    }
    const onSubmit = (event) => {
        event.preventDefault();

        const variables = {
            content: CommentValue,
            writer: user.userData._id,
            postId : props.postId,
            responseTo :props.comment._id,
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
        });

    }
    const onHandleChange= (event) => {
        setCommentValue(event.currentTarget.CommentValue)
    }
    const actions = [
        <span onClick={onClickReplyOpen} key="comment-basic-reply-to"> Reply to</span>
    ]

    return (
        <div>
            <Comment 
                actions={actions}
                author={props.comment.writer.name}
                avatar={<Avatar src={props.comment.writer.image} alt />}
                content={ <p> {props.comment.content} </p>}
            />

            {OpenReply &&
            
                <form style = {{ display : 'flex'}} onSubmit={onSubmit}>
                <textarea
                    style = {{ width : '100%', borderRadius : '5px' }}
                    onChange={onHandleChange}
                    value={CommentValue}
                    placeholder = "코멘트를 작성해 주세요"
                />
                <br />
                <button style = {{ width : '20%' , height : '52px' }} onClick={onSubmit}>Submit</button>
                </form>
            }
       


        </div>
    )
}

export default SingleComment
