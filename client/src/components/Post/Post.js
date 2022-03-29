import React from "react";
import "./Post.css";
import { gql, useMutation } from "@apollo/client";

const PUBLISH_POST = gql`
  mutation PublishPost($postId: ID!) {
    postPublish(postId: $postId) {
      userErrors {
        message
      }
      post {
        title
        published
      }
    }
  }
`;

const UNPUBLISH_POST = gql`
  mutation UnpublishPost($postId: ID!) {
    postUnpublish(postId: $postId) {
      userErrors {
        message
      }
      post {
        title
        published
      }
    }
  }
`;

export default function Post({
  title,
  content,
  date,
  user,
  published,
  id,
  isMyProfile,
}) {
  // This is what we get from a mutation, an array with the function to execute, the data and loading state.
  const [publishPost, { data, loading }] = useMutation(PUBLISH_POST, {
    variables: {
      postId: id,
    },
  });

  const [unpublishPost, { data: unpublishData, loading: unpublishLoading }] =
    useMutation(UNPUBLISH_POST, {
      variables: {
        postId: id,
      },
    });

  const formatedDate = new Date(Number(date));
  return (
    <div
      className="Post"
      style={!published ? { backgroundColor: "hotpink" } : {}}
    >
      {isMyProfile && !published && (
        <p
          className="Post__publish"
          onClick={() => {
            publishPost({ variables: { postId: id } });
          }}
        >
          {loading ? "Please refresh" : "Publish"}
        </p>
      )}
      {isMyProfile && published && (
        <p
          className="Post__publish"
          onClick={() => {
            unpublishPost({ variables: { postId: id } });
          }}
        >
          {unpublishLoading ? "Please refresh" : "Unpublish"}
        </p>
      )}
      <div className="Post__header-container">
        <h2>{title}</h2>
        <h4>
          Created At {`${formatedDate}`.split(" ").splice(0, 3).join(" ")} by{" "}
          {user}
        </h4>
      </div>
      <p>{content}</p>
    </div>
  );
}
