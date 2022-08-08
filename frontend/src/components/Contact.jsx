const Contact = ({ avatar_url, name }) => (
  <div className="flex my-5 mx-2 p-5 text-xl bg-[#3d3e51]">
    <div className="bg-black rounded-full overflow-clip">
      <img src={avatar_url} alt="avatar" className="w-14 " />
    </div>
    <span className="first-letter:capitalize ml-5 my-auto">{name}</span>
  </div>
);
export default Contact;
