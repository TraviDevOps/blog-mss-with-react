import { useState, useEffect } from "react";
import axios from "axios";

function CommentList({ postId }) {
    const [comments, setComments] = useState({});
    const commentsMicroserviceUrl = import.meta.env.VITE_COMMENTS_MICROSERVICE_URL;

    const fetchComments = async () => {
        const response = await axios.get(`${commentsMicroserviceUrl}/posts/${postId}/comments`);

        setComments(response.data);
    };

    useEffect(() => {
        fetchComments();
    }, []);

    const renderedComments = Object.values(comments).map(comment => {
        return <li key={comment.id}>{comment.content}</li>
    });

    return (
        <ul>
            {renderedComments}
        </ul>
    )
}

export default CommentList;