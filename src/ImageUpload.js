import React, {useState} from 'react';
import { Button } from "@material-ui/core"; 
import { storage, db } from "./firebase";
import './imageUpload.css';
import firebase from "firebase";

function ImageUpload({username}){
    //+사진선택 버튼
    const [image, setImage] = useState(null);
    //+로딩바
    const [progress, setProgress] = useState(0);
    //+피드 글
    const [caption, setCaption] = useState('');

    const handleChange = (e) => {
        //e.target.files[0] -> 만일 두 파일을 선택하면 처음 파일을 가져와라. 
        if(e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        //+ 업로드 버튼을 누르면 이미지 이름이 나온다.
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        
        //uploadTask.on은 visual만 해당.
        //upload 기능은 없다.
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                //progress function ...
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            //에러 기능
            (error) => {
                //Error function
                console.log(error);
                alert(error.message);
            },

            //complete function
            () => {
               
                //go and get a download link now!!
                    storage
                    .ref("images")
                    .child(image.name)
                    //+ 중요! 다운로드 링크로 가서 실제로 사용 가능하게 만든다.
                    .getDownloadURL()
                    .then(url => {
                        //post image inside db
                        db.collection("posts").add({
                          //+ timestamp -> 코드에 존재하는 서버의 시간을 가져옴(최근 피드가 상위로 올라옴.)
                          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                          caption: caption,
                          imageUrl: url,
                          username: username
                        });
                        //+ 끝난 후 유저 폼 리셋하여 업로드 부분 초기화
                        setProgress(0);
                        setCaption("");
                        setImage(null);
                })
            }
        )
    }

    return  (
        <div className="imageupload">
            <progress className="imageupload__progress" value={progress} max="100"/>
            <input type="text" placeholder='Enter a caption...' onChange={event => setCaption(event.target.value)} value = {caption}/>
            <input type="file" onChange={handleChange} />
            <Button onClick={handleUpload}>
                Upload
            </Button>
        </div>
    )
}

export default ImageUpload
