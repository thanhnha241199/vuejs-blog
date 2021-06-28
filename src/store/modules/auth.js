import axios from "axios";

const state = {
  user: null,
  posts: null,
};

const getters = {
  isAuthenticated: (state) => !!state.user,
  StatePosts: (state) => state.posts,
  StateUser: (state) => state.user,
};

const actions = {

  async Register({dispatch}, form) {
    await axios.post('register', form).then(response=>{
     if(response.status==200){
      dispatch('LogIn', form)
      
     }
    })
   
  },

  async LogIn({commit}, user) {
    let formData = {
      "username": user.username,
      "password": user.password
    };
    console.log(formData)
    await axios.post("authenticate",formData).then(res=> {
      if(res.status==200){
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('username', res.data.username);
        localStorage.setItem('id', res.data.id);
        commit("setUser", res.data.username);
      }
    });
  },

  async CreatePost({ dispatch }, post) {
    await axios.post("post/", {
      "content": post.content,
      "like": "0",
      "uid": localStorage.getItem('id'),
      "shared": "0"
    },
    {
      headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization":  `Bearer ${localStorage.getItem('token')}`
    }});
    return await dispatch("GetPosts");
  },


  async GetPosts({ commit }) {
    let response = await axios.get("post/",{
      headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization":  `Bearer ${localStorage.getItem('token')}`
    }});
    commit("setPosts", response.data);
  },

  async LogOut({ commit }) {
    let user = null;
    localStorage.removeItem('username');
    localStorage.removeItem('id');
    localStorage.removeItem('token');
    commit("logout", user);
  },
};

const mutations = {
  setUser(state, username) {
    state.user = username;
  },

  setPosts(state, posts) {
    state.posts = posts;
  },
  logout(state, user) {
    state.user = user;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};