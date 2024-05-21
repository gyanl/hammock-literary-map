import { Author } from "..";

export default function AuthorCard({
  author,
  setAuthor,
}: {
  author: Author;
  setAuthor: (a: Author) => void;
}) {
  const {
    author_name: name,
    city_birth,
    work_1: work1,
    work_2: work2,
  } = author;
  return (
    <div className="sidebar-author" onClick={() => setAuthor(author)}>
      <h3>
        {name}
        <br />
        <span className="color-mid-green">{city_birth}</span>
      </h3>
      <p className="text-label padtop">Author of</p>
      <p>{work1}</p>
      <p>{work2}</p>
    </div>
  );
}
