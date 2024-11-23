import React from "react";

function SingerCard({ singer, onUpvote, onDownvote, onHire }) {
    return (
        <div>
            <h2>{singer.name}</h2>
            <p>{singer.bio}</p>
            <img src={singer.mediaUrl} alt="singer media" width="200" />
            <p>Upvotes: {singer.upvotes}</p>
            <p>Downvotes: {singer.downvotes}</p>
            <p>Hired: {singer.hireCount} times</p>
            <button onClick={() => onUpvote(singer._id)}>Upvote</button>
            <button onClick={() => onDownvote(singer._id)}>Downvote</button>
            <button onClick={() => onHire(singer._id)}>Hire</button>
        </div>
    );
}

export default SingerCard;
