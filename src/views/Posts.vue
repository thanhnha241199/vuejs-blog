<template>
  <div class="container">

    <div v-if="User">
      <p>Hi {{ User }}</p>
    </div>
    <div>
      <form @submit.prevent="submit">
        <div>
          <textarea
            name="content"
            v-model="form.content"
            placeholder="Write up..."
          ></textarea>
        </div>
           <md-button class="md-raised md-primary" type="submit">Submit</md-button>
      </form>
    </div>
    
    <div class="posts" v-if="Posts">
      <ul>
        <li v-for="post in Posts" :key="post.id">
           <div id='post-div'>
            <md-card md-with-hover>
              <md-ripple>
                <md-card-header>
                  <div class="md-title">UID: {{post.uid}}</div>
                </md-card-header>

                <md-card-content>
                  {{post.content}}
                </md-card-content>

                <md-card-actions>
                  <md-button v-on:click="likePost(post)">Like ({{post.likes}})</md-button>
                  <md-button v-on:click="sharePost(post)">Share ({{post.shared}})</md-button>
                  <div v-if="post.uid == '2'">
                    <md-button v-on:click="deletePost(post.id)">Delete</md-button>
                  </div>
                 
                </md-card-actions>
              </md-ripple>
            </md-card>
          </div>
        </li>
      </ul>
    </div>
    
    <div v-else>Oh no!!! We have no posts</div>
  </div>
  
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import axios from "axios";
export default {
  name: "Posts",
  components: {},
  data() {
    return {
      form: {
        content: "",
      },
    };
  },
  created: function() {
    // a function to call getposts action
    this.GetPosts()
  },
  computed: {
    ...mapGetters({ Posts: "StatePosts", User: "StateUser" }),
  },
  methods: {
    ...mapActions(["CreatePost", "GetPosts"]),
    async submit() {
      try {
        await this.CreatePost(this.form);
      } catch (error) {
        throw "Sorry you can't make a post now!"
      }
    },
    async deletePost(id) {
       try {
         await axios.delete(`post/${id}/`,
          {
            headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization":  `Bearer ${localStorage.getItem('token')}`
          }});
          this.GetPosts()
      } catch (error) {
        throw "Sorry you can't make a post now!"
      }
    },
    async likePost(post) {
      console.log(post.likes++)
       try {
         await axios.put(`post/${post.id}/`,{         
            "content": post.content,
            "likes": post.likes++,
            "uid": post.uid,
            "shared": post.shared
          },
          {
            headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization":  `Bearer ${localStorage.getItem('token')}`
          }});
          await axios.post(`like/`,{         
            "postid": post.id,
            "uid": localStorage.getItem('id'),
          },
          {
            headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization":  `Bearer ${localStorage.getItem('token')}`
          }});
          this.GetPosts()
      } catch (error) {
        throw "Sorry you can't make a post now!"
      }
    },
  async sharePost(post) {
    console.log(post.shared++)
       try {
         await axios.put(`post/${post.id}/`,{         
            "content": post.content,
            "likes": post.likes,
            "uid": post.uid,
            "shared": post.shared++
          },
          {
            headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization":  `Bearer ${localStorage.getItem('token')}`
          }});
          await axios.post(`share/`,{         
            "postid": post.id,
            "uid": localStorage.getItem('id'),
          },
          {
            headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization":  `Bearer ${localStorage.getItem('token')}`
          }});
          this.GetPosts()
      } catch (error) {
        throw "Sorry you can't make a post now!"
      }
    },
  },

};
</script>
<style scoped>
* {
  box-sizing: border-box;
}
label {
  padding: 12px 12px 12px 0;
  display: inline-block;
}
button[type="submit"] {
  background-color: #4caf50;
  color: white;
  padding: 12px 20px;
  cursor: pointer;
  border-radius: 30px;
  margin: 10px;
}
button[type="submit"]:hover {
  background-color: #45a049;
}
input {
  width: 60%;
  margin: 15px;
  border: 0;
  box-shadow: 0 0 15px 4px rgba(0, 0, 0, 0.06);
  padding: 10px;
  border-radius: 30px;
}
textarea {
  width: 75%;
  resize: vertical;
  padding: 15px;
  border-radius: 15px;
  border: 0;
  box-shadow: 0 0 15px 4px rgba(0, 0, 0, 0.06);
  height: 150px;
  margin: 15px;
}
ul {
  list-style: none;
}
#post-div {
  border: 3px solid #000;
  width: 500px;
  margin: auto;
  margin-bottom: 5px;
}
</style>