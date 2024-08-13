import { useState } from "react"
import axios from "axios";

function CommentCreate({ postId }) {
    const [content, setContent] = useState('');
    const commentsMicroserviceUrl = import.meta.env.VITE_COMMENTS_MICROSERVICE_URL;

    const onSubmit = async (event) => {
        event.preventDefault();

        await axios.post(`${commentsMicroserviceUrl}/posts/${postId}/comments`, { content });

        setContent('');
    }

    return (
        <form onSubmit={onSubmit}>
            <div className="form-group">
                <label>New Comment</label>
                <input
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    className="form-control"
                />
            </div>
            <button className="btn btn-primary">Submit</button>
        </form>
    )
};

export default CommentCreate;