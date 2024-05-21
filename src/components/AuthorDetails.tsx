import { Author } from "..";

function getOrdinalSuffix(number: number) {
  const suffixes = ["th", "st", "nd", "rd"];
  const remainder = number % 100;
  const suffix =
    suffixes[(remainder - 20) % 10] || suffixes[remainder] || suffixes[0];
  return suffix;
}

function getCentury(year: number) {
  const century = Math.ceil(year / 100);
  return `${century}${getOrdinalSuffix(century)} Century`;
}

export default function AuthorDetails({ author }: { author: Author }) {
  const {
    author_name: name,
    work_1: work1,
    work_2: work2,
    city_residence,
    city_birth,
    year_birth,
    year_death,
    country,
  } = author;
  return (
    <>
      <h3>{name}</h3>
      <p className="text-label padtop">Author of</p>
      <p>{work1}</p>
      <p>{work2}</p>

      <div className="flex-equal">
        <div className="flex-1">
          <p className="text-label padtop">Birthplace</p>
          <span className="color-mid-green">{city_birth}</span>
        </div>
        <div className="flex-1">
          <p className="text-label padtop">Residence</p>
          <span className="color-mid-green">{city_residence}</span>
        </div>
      </div>
      <div className="pill-container">
        <span className="pill pill-country">{country}</span>
        <span className="pill pill-sex">Female</span>
        <span className="pill pill-era">{getCentury(year_birth)}</span>
        {year_death && getCentury(year_death) !== getCentury(year_birth)
          ? `<span class="pill pill-era">${getCentury(year_death)}</span>`
          : ""}
      </div>
      <p className="text-label padtop">Bio</p>
      <p className="bio">
        Author of the famous book {work1} and {work2}. Born in {city_birth}
        {year_birth ? `in ${year_birth}` : "god knows when"}
        {year_death
          ? ` and died in ${year_death}`
          : " and is still alive and kicking"}
        .
      </p>
    </>
  );
}
