import { useState } from 'react';
import axios from 'axios';

function PostCreate() {
    const postsMicroserviceUrl = import.meta.env.VITE_POSTS_MICROSERVICE_URL;

    const [title, setTitle] = useState('');

    const onSubmit = async (event) => {
        event.preventDefault();

        await axios.post(`${postsMicroserviceUrl}/posts`, { title });

        setTitle('');
    }


    return <div>
        <form onSubmit={onSubmit}>
            <div className="form-group">
                <label>Title</label>

                <input value={title} onChange={e => setTitle(e.target.value)} className="form-control" />
            </div>
            <button className="btn btn-primary">Submit</button>
        </form>
    </div>
}

export default PostCreate;