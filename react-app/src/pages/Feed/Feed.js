import React, { Component, Fragment } from "react";
import openSocket from "socket.io-client";

import Post from "../../components/Feed/Post/Post";
import Button from "../../components/Button/Button";
import FeedEdit from "../../components/Feed/FeedEdit/FeedEdit";
import Input from "../../components/Form/Input/Input";
import Paginator from "../../components/Paginator/Paginator";
import Loader from "../../components/Loader/Loader";
import ErrorHandler from "../../components/ErrorHandler/ErrorHandler";
import "./Feed.css";
import { config } from "../../config";

const PAGE_SIZE = 2;

class Feed extends Component {
  state = {
    isEditing: false,
    posts: [],
    totalPosts: 0,
    editPost: null,
    status: "",
    postPage: 1,
    postsLoading: true,
    editLoading: false,
  };

  componentDidMount() {
    const gqlQuery = {
      query: `{
        getStatus {
          status
        }
      }`,
    };

    fetch(`${config.apiGraphqlUrl}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.props.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gqlQuery),
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        if (resData.errors && resData.errors.length) {
          throw new Error(resData.errors[0].message);
        }
        this.setState({ status: resData.data.getStatus.status });
      })
      .catch(this.catchError);

    this.loadPosts();

    const socket = openSocket(`${config.apiUrl}`);

    socket.on("posts", (data) => {
      if (data.action === "create") {
        this.addPost(data.post);
      } else if (data.action === "update") {
        this.updatePost(data.post);
      } else if (data.action === "delete") {
        this.loadPosts();
      }
    });
  }

  addPost = (post) => {
    this.setState((prevState) => {
      const updatedPosts = [post, ...prevState.posts];

      if (updatedPosts.length > PAGE_SIZE) {
        updatedPosts.pop();
      }

      return {
        posts: updatedPosts,
        totalPosts: prevState.totalPosts + 1,
      };
    });
  };

  updatePost = (post) => {
    this.setState((prevState) => {
      const updatedPosts = [...prevState.posts];
      const updatedPostIndex = updatedPosts.findIndex((p) => p.id === post.id);
      if (updatedPostIndex > -1) {
        updatedPosts[updatedPostIndex] = post;
      }
      return {
        posts: updatedPosts,
      };
    });
  };

  loadPosts = (direction) => {
    if (direction) {
      this.setState({ postsLoading: true, posts: [] });
    }
    let page = this.state.postPage;
    if (direction === "next") {
      page++;
      this.setState({ postPage: page });
    }
    if (direction === "previous") {
      page--;
      this.setState({ postPage: page });
    }

    const gql = {
      query: `query GetPosts($page: Int, $pageSize: Int) {
        posts(pageParam: { page: $page, pageSize: $pageSize }) {
          totalItems
          posts {
            id
            title
            content
            imageUrl
            creator { name }
            createdAt
          }
        }
      }`,
      variables: {
        page,
        pageSize: PAGE_SIZE,
      }
    };

    fetch(`${config.apiGraphqlUrl}`, {
      method: "POST",
      body: JSON.stringify(gql),
      headers: {
        Authorization: `Bearer ${this.props.token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        if (resData.errors && resData.errors.length) {
          throw new Error(resData.errors[0].message);
        }

        this.setState({
          posts: resData.data.posts.posts,
          totalPosts: resData.data.posts.totalItems,
          postsLoading: false,
        });
      })
      .catch(this.catchError);
  };

  statusUpdateHandler = (event) => {
    event.preventDefault();

    const gqlQuery = {
      query: `mutation UpdateStatus($status: String) {
        updateStatus(status: $status) {
          status
        }
      }`,
      variables: {
        status: this.state.status
      }
    };

    fetch(`${config.apiGraphqlUrl}`, {
      method: "POST",
      body: JSON.stringify(gqlQuery),
      headers: {
        Authorization: `Bearer ${this.props.token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        if (resData.errors && resData.errors.length) {
          throw new Error(resData.errors[0].message);
        }
        console.log(resData);
      })
      .catch(this.catchError);
  };

  newPostHandler = () => {
    this.setState({ isEditing: true });
  };

  startEditPostHandler = (postId) => {
    this.setState((prevState) => {
      const loadedPost = { ...prevState.posts.find((p) => p.id === postId) };

      return {
        isEditing: true,
        editPost: loadedPost,
      };
    });
  };

  cancelEditHandler = () => {
    this.setState({ isEditing: false, editPost: null });
  };

  finishEditHandler = (postData) => {
    this.setState({
      editLoading: true,
    });

    let gql = {
      query: `mutation CreatePost($title: String, $content: String, $imageUrl: String) {
        createPost(post: {
          title: $title,
          content: $content,
          imageUrl: $imageUrl
        }) {
          id
          title
        }
      }`,
      variables: {
        title: postData.title,
        content: postData.content,
        imageUrl: 'placeholder.jpg',
      }
    };

    if (this.state.editPost) {
    }

    fetch(`${config.apiGraphqlUrl}`, {
      method: "POST",
      body: JSON.stringify(gql),
      headers: {
        Authorization: `Bearer ${this.props.token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        if (resData.errors && resData.errors.length) {
          throw new Error(resData.errors[0].message);
        }

        this.setState((prevState) => {
          return {
            isEditing: false,
            editPost: null,
            editLoading: false,
          };
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          isEditing: false,
          editPost: null,
          editLoading: false,
          error: err,
        });
      });
  };

  statusInputChangeHandler = (input, value) => {
    this.setState({ status: value });
  };

  deletePostHandler = (postId) => {
    this.setState({ postsLoading: true });
    fetch(`${config.apiUrl}/feed/post/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${this.props.token}`,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Deleting a post failed!");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
      })
      .catch((err) => {
        console.log(err);
        this.setState({ postsLoading: false });
      });
  };

  errorHandler = () => {
    this.setState({ error: null });
  };

  catchError = (error) => {
    this.setState({ error: error });
  };

  render() {
    return (
      <Fragment>
        <ErrorHandler error={this.state.error} onHandle={this.errorHandler} />
        <FeedEdit
          editing={this.state.isEditing}
          selectedPost={this.state.editPost}
          loading={this.state.editLoading}
          onCancelEdit={this.cancelEditHandler}
          onFinishEdit={this.finishEditHandler}
        />
        <section className="feed__status">
          <form onSubmit={this.statusUpdateHandler}>
            <Input
              type="text"
              placeholder="Your status"
              control="input"
              onChange={this.statusInputChangeHandler}
              value={this.state.status}
            />
            <Button
              mode="flat"
              type="submit"
              onClick={this.statusUpdateHandler}
            >
              Update
            </Button>
          </form>
        </section>
        <section className="feed__control">
          <Button mode="raised" design="accent" onClick={this.newPostHandler}>
            New Post
          </Button>
        </section>
        <section className="feed">
          {this.state.postsLoading && (
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <Loader />
            </div>
          )}
          {this.state.posts.length <= 0 && !this.state.postsLoading ? (
            <p style={{ textAlign: "center" }}>No posts found.</p>
          ) : null}
          {!this.state.postsLoading && (
            <Paginator
              onPrevious={this.loadPosts.bind(this, "previous")}
              onNext={this.loadPosts.bind(this, "next")}
              lastPage={Math.ceil(this.state.totalPosts / 2)}
              currentPage={this.state.postPage}
            >
              {this.state.posts.map((post) => (
                <Post
                  key={post.id}
                  id={post.id}
                  author={post.creator.name}
                  date={new Date(post.createdAt).toLocaleDateString("en-US")}
                  title={post.title}
                  image={`${config.imagesUrl}/${post.imageUrl}`}
                  content={post.content}
                  onStartEdit={this.startEditPostHandler.bind(this, post.id)}
                  onDelete={this.deletePostHandler.bind(this, post.id)}
                />
              ))}
            </Paginator>
          )}
        </section>
      </Fragment>
    );
  }
}

export default Feed;
