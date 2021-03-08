import React, {useEffect,useState} from 'react'
import {Row, Col, List, Avatar} from 'antd';
import axios from 'axios';
import SideVideo from './Sections/SideVideo';
import Subscriber from './Sections/Subscriber';
import Comment from './Sections/Comment';
function VideoPage(props) {
    const videoId = props.match.params.videoid;
    const [Video, setVideo] = useState([])
    const [Comments, setComments] = useState([]);
    const videoVariable = {
        videoId: videoId
    }

    useEffect(() => {
        axios.post('/api/video/getVideo', videoVariable)
            .then(response => {
                if (response.data.success) {
                    setVideo(response.data.video);
                } else {
                    alert('Failed to get video Info');
                }
            })
        axios.post('/api/comment/getComments', videoVariable)
            .then(response => {
                if (response.data.success) {
                    setComments(response.data.comments);
                } else {
                    alert('Failed to get comment')
                }
            })
    }, [])


    const refreshFunction= (newComment) => {
        setComments(Comments.concat(newComment));
    };


    if (Video.writer) {
        const subscribeButton = Video.writer._id !== localStorage.getItem('userId') && <Subscriber userTo={Video.writer._id} userFrom={localStorage.getItem('userId')} />
        
        return (
            <Row>
                <Col lg={18} xs={24}>
                    <div className="postPage" style={{ width: '100%', padding: '3rem 4em' }}>
                        <video style={{ width: '100%' }} src={`http://localhost:5000/${Video.filePath}`} controls></video>

                        <List.Item
                            actions={[ subscribeButton]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={Video.writer && Video.writer.image} />}
                                title={<a href="https://ant.design">{Video.title}</a>}
                                description={Video.description}
                            />
                            <div></div>
                        </List.Item>
                        <Comment refreshFunction={refreshFunction} commentLists={Comments} postId = {videoId}/>
                    </div>
                </Col>
                <Col lg={6} xs={24}>

                    <SideVideo />

                </Col>
            </Row>
        )

    } else {
        return (
            <div>Loading...</div>
        )
    }


}

export default VideoPage
