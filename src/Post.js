import React, {useState, useEffect} from 'react';
import './Post.css';
import { db } from './firebase';
import Avatar from "@material-ui/core/Avatar";
import firebase from 'firebase';



//username: 게시물을 작성한 사람
//user: 현재 로그인 한 사람
function Post({postId, user, username, caption, imageUrl}) {
    //댓글
    const [comments, setComments]=useState([]);
    const [comment, setComment]=useState('');
    
    // firebase에서 comments 부분 접근 -> 댓글추가
    // 특정 게시물 내부에 comment로 댓글이 추가됨 (=중첩목록)
    //+ 리스너 이용해서 댓글 추가
    useEffect(() => {
        let unsubscribe;
        if(postId){
            unsubscribe=db 
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy('timestamp', 'desc')
                .onSnapshot((snapshot)=>{
                    setComments(snapshot.docs.map((doc)=>doc.data()));
                });
        }

        return ()=>{
            unsubscribe();
        };
    }, [postId]); //내부 변수 postId가 변경되면 다시 실행됨


    // 댓글버튼 
    // + 이 기능은 댓글을 입력하면 파이어베이스 데이터베이스에에 제출함.
    const postComment =(event)=>{
        event.preventDefault();
        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            //user: 로그인한사람 username: 댓글쓴 사람
            username: user.displayName,
            //댓글을 시간에 따라 순서대로 정렬해줌.
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('');
    }



    return (
        <div className="post">
            {/* header -> avater + username */}
            <div className="post__header">
                {/* 아바타는 게시물 올렸을때 프로필 아이콘 alt에 첫글자가 들어감*/}
                <Avatar
                    className="post__avater" alt = {username}
                    src="/static/images/avater/1.png" />
                    {/* 아래는 포스트의 유저 이름 */}
                <h3>{username}</h3>
            </div>

            {/* image */}
            <img className="post__image" src={imageUrl} alt="" />

            {/* username + caption 캡션은 유저가 포스트 올릴때 남기는것 아래는 유저이름과 해당 내용*/}
            <h4 className="post__text"><strong>{username} </strong>{caption}</h4>
    
            <div className="post__comments">
                {comments.map((comment) => (
                    <p>
                        <strong>{comment.username}</strong> {comment.text}
                    </p>
                ))}
            </div>

            {/* + 로그아웃 하면 댓글창 없어지는 기능 */}
            {user && (
            <form className="post__commentBox">
                <input
                    className="post__input"
                    type="text"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e)=>setComment(e.target.value)} 
                />
                
                <button
                    disabled={!comment}
                    className="post__button"
                    type="submit"
                    onClick={postComment}>
                    Post
                </button>
            </form>)}


        </div>
    )
}

export default Post