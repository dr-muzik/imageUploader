// import { ChangeEvent, useState } from 'react'

import './App.css'

import React, { ChangeEvent, useEffect, useState } from 'react';
import axios from 'axios';

interface Ipost {
  image_url: string;
  description: string;
  id: number;
  timestamp: string;
}

function App() {
  const [file, setFile] = useState<File | null>(null); // Fix: Specify File type instead of FileList
  const [description, setDescription] = useState<string>("");
  const [posts, setPosts] = useState<Ipost[]>([]);

  //getting the images from database as soon as the page loads
  useEffect(() => {
    (async() => {
      const result = await axios.get('/api/posts');
      setPosts(result.data.posts)

      console.log(posts);
    })()
  }, [])

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      console.error("Please select a file");
      return;
    }

    const data = new FormData();
    data.append('image', file);
    data.append('description', description);

    try {
      //fetching from backend api
      const result = await axios.post('/api/posts', data);
      console.log(result);

      
      setPosts([result.data, ...posts]) //instantly displaying the newly posted image on browser
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const deleteHandler = async(postId: number) => {
    try {
      if(window.confirm('are you sure you want to delete this post?')){
        const result = await axios.delete(`/api/posts/${postId}`);
        console.log(result.data);

        // Update local state to reflect the deletion
        setPosts(posts.filter(post => post.id !== postId));
      }
    } catch (error) {
      console.log('error', error)
    }
    
  }

  //creating the serverUrl variable to be used in displaying the image in the client
  const serverBaseUrl = 'http://localhost:3000';

  return (
    <div className='App'>
      <header>
        <h1>App4000</h1>
      </header>
      <form onSubmit={submit}>
        <input
          type="file"
          name="image" // Fix: Set name attribute for file input
          onChange={(e: ChangeEvent<HTMLInputElement>) => setFile(e.target.files?.[0] || null)} // Fix: Use e.target.files
          accept='image/*'
        />
        <input
          type="text"
          name="description" // Fix: Set name attribute for text input
          onChange={e => setDescription(e.target.value)}
          placeholder="description"
        />
        <button type="submit">Submit</button>
      </form>
      <main>
        {posts.map(post => (
          // in order for the image to show i had to manually add the 
          // serverUrl path into the src attribute
          <figure key={post.id}>
            <img src={`${serverBaseUrl}${post.image_url}`} alt={post.description} />
            <figcaption>{post.description}</figcaption>
            <button type="submit" onClick={() => deleteHandler(post.id)}>delete</button>
          </figure>
        ))}
      </main>
    </div>
  );
}

export default App;

