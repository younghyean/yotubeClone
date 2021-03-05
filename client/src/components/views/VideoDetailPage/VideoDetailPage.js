import React, {useEffect,useState} from 'react'
import {Row, Col, List, Avatar} from 'antd';
import Axios from 'axios';
import SideVideo from './Sections/SideVideo';
function VideoDetailPage(props) {
    
    const videoId = props.match.params.videoid;
    const variables = { videoId :videoId };
    const  [VideoDetail, setVideoDetail] = useState([]);

    useEffect(() => {
        
        Axios.post('/api/video/getVideoDetail', variables)
            .then(response => {
                if(response.data.success) {
                    setVideoDetail(response.data.VideoDetail);
                }
                else{
                    alert("비디오 정보 가져오길 실패");
                }
            })
        return () => {
            
        }
    }, [])
    if(VideoDetail.writer){
        return (
            <Row gutter = {[16,16]}>
                <Col lg={18} xs={24}>
                <div style={{ width : '100%', padding:'3ream, 4ream'}}>
                    <video style = {{ width :'100%'}} src={`http://localhost:5000/${VideoDetail.filePath}`}controls/>
                    <List.Item
                        actions
                    >
                        <List.Item.Meta
                            avatar={<Avatar src={VideoDetail.writer.image} />}
                            title={VideoDetail.writer.name}
                            description={VideoDetail.writer.description}
                            />
    
                    </List.Item>
                </div>
    
                </Col>
                <Col lg={6} xs={24}>
                    <SideVideo />

                </Col>
    
            </Row>
        )
    } else{
        return(
            <div>...loading</div>
        )
    }

}
export default VideoDetailPage
