import React, {useEffect, useState} from 'react'
import Axios from 'axios';
function SideVideo() {
    
    const [sideVideo, setsideVideo] = useState([])

    useEffect(() => {
        Axios.get('/api/video/getVideos')
        .then(response => {
            if(response.data.success){
                setsideVideo(response.data.videos);
            }
            else{
                alert('비디오 가져오기 실패')
            }
        })
        return () => {
            
        }
    }, )


    const renderSideVideo = sideVideo.map((video, index)=>{
        let minutes = Math.floor(video.duration / 60);
        let seconds = Math.floor((video.duration - minutes * 60));
       
       return <div key={index} style = {{ display : 'flex', marginBottom : "1rem", padding : '0 2rem'}}>
            <div style ={{ width : '40%', marginRight : '1rem'}}>
                <a href>
                    <img style ={{ width : '100%'}} src={`http://localhost:5000/${video.thumbnail}`} alt="thumbnail"/>
                </a>
            </div>
            
            <div style = {{width : '50%'}}>

                <a href style={{ color: "gray"}}>
                    <span style = {{ fontSize: '1rem', color:'black'}} >{video.title}</span><br />
                    <span>{video.writer.name} </span><br />
                    <span>{video.views} views </span><br />
                    <span>{minutes} : {seconds} </span>
                </a>
            </div>
        </div>

    }); 
    
    return (
        
    <React.Fragment>
        
        <div style={{marginTop : '3rem'}} />

        {renderSideVideo}

    </React.Fragment>



        
    )
}

export default SideVideo
