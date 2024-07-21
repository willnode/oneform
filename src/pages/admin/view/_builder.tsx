// Editor.jsx
import config from "@/components/editor/puck";
import { Puck, type Data } from "@measured/puck";
import "@measured/puck/puck.css";

// Describe the initial data
let data = localStorage?.getItem('puck-data');
const initialData = data ? JSON.parse(data) : {};

// Save the data to your database
const save = (data: Data) => {
  localStorage.setItem('puck-data', JSON.stringify(data))
  console.log(data);
};

// Render Puck editor
export default function Editor() {
  return <Puck config={config} data={initialData} onPublish={save} />;
}