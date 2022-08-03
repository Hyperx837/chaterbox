const Contact = ({ avatar_url, name }) => {
  <div>
    <img src={avatar_url} alt="avatar" />
    <span>{name}</span>
  </div>;
};
export default Contact;
