import React, {useEffect, useState} from 'react'
import { Tooltip, Icon} from 'antd';
import Axios from 'axios';
function LikeDislike(props) {
   
    const  [Likes, setLikes] = useState(0);
    const  [Dislikes, setDislikes] = useState(0);
    const  [LikeAction, setLikeAction] = useState(null);
    const  [DislikeAction, setDislikeAction] = useState(null);
    let variable = {

    }
    if(props.video){
            variable = {videoId : props.videoId, userId : props.userId }
        
    }
    else {
        
        variable = {commentId : props.commentId , userId :  props.userId}
    }
   
    useEffect(() => {
        Axios.post('/api/like/getLikes', variable)
        .then(response => {
            if(response.data.success) {
                setLikes(response.data.likes.length);
                debugger;
                response.data.likes.map(like => {
                    if(like.userId === props.userId) {
                        setLikeAction('liked');
                    }
                })
            }
            else{
                alert('like정보를 가져오는데 실패');
            }
        })


        Axios.post('/api/like/getDislikes', variable)
        .then(response => {
            if(response.data.success) {
                setDislikes(response.data.dislikes.length);

                response.data.dislikes.map(dislike => {
                    if(dislike.userId === props.userId) {
                        setDislikeAction('disliked');
                    }
                })
            }
            else{
                alert('dislike정보를 가져오는데 실패');
            }
        })

        return () => {
            
        }
    }, [])

    const onDislike =() => {
        if(DislikeAction === null) {
            Axios.post('/api/like/upDislike', variable)
            .then(response => {
                if(response.data.success){
                    setDislikes(Dislikes+1);
                    setDislikeAction('disliked');

                    if(LikeAction !== null){
                        setLikeAction(null);
                        setLikes(Likes -1);
                    }
                }
                else{
                    alert("싫어요 올리기 실패");
                }
            })
        }
        else{

            Axios.post('/api/like/unDislike', variable)
            .then(response => {
                if(response.data.success){
                    setDislikes(Dislikes-1);
                    setDislikeAction(null);
                }
                else{
                    alert("싫어요 내리기 실패");
                }
            })

        }
    }
    const onLike =() => {
        if(LikeAction === null) {
            Axios.post('/api/like/uplike', variable)
            .then(response => {
                if(response.data.success){
                    setLikes(Likes+1);
                    setLikeAction('liked');

                    if(DislikeAction !== null){
                        setDislikeAction(null);
                        setDislikes(Dislikes -1);
                    }
                }
                else{
                    alert("좋아요 올리기 실패");
                }
            })
        }
        else{

            Axios.post('/api/like/unlike', variable)
            .then(response => {
                if(response.data.success){
                    setLikes(Likes-1);
                    setLikeAction(null);
                }
                else{
                    alert("좋아요 내리기 실패");
                }
            })

        }
    }
    return (
        <div>
            <span key = "comment-basic-like">
                <Tooltip title = "Like">
                    <Icon type = "like"
                    theme ={LikeAction === 'liked' ? "filled" : 'outlined'}
                    onClick={onLike}
                />
                </Tooltip>
                <span style = {{ paddingLeft : '8px', cursor : 'auto'}}> {Likes} </span>
            </span>&nbsp;&nbsp;
            <span key = "comment-basic-dislike">
                <Tooltip title = "Dislike">
                    <Icon type = "dislike"
                    theme ={DislikeAction === 'disliked' ? "filled" : 'outlined'}
                    onClick={onDislike}
                />
                </Tooltip>
                <span style = {{ paddingLeft : '8px', cursor : 'auto'}}> {Dislikes} </span>
            </span>&nbsp;&nbsp;
        </div>
    )
}

export default LikeDislike
