import React, { useEffect, useState } from "react";

const Assignment = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://anapioficeandfire.com/api/houses")
      .then((response) => response.json())
      .then((data) => {
        const fetchDetails = async () => {
          const updatedData = await Promise.all(
            data.map(async (house) => {
              const titles = house.titles.length ? house.titles.join(", ") : "None";
              const swornMembersNames = await Promise.all(
                house.swornMembers.map(async (url) => {
                  const response = await fetch(url);
                  const memberData = await response.json();
                  return memberData.name;
                })
              );
              const swornMembers = swornMembersNames.length ? swornMembersNames.join(", ") : "None";
              return { ...house, titles, swornMembers };
            })
          );
          setData(updatedData);
        };

        fetchDetails();
      })
      .catch((error) => {
        setError(error);
      });
  }, []);

  return (
    <>
      {error ? (
        <p>{error.message}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name of the House</th>
              <th>Region</th>
              <th>Titles</th>
              <th>Sworn Members</th>
            </tr>
          </thead>
          <tbody>
            {data.map((house) => (
              <tr key={house.url}>
                <td>{house.name}</td>
                <td>{house.region}</td>
                <td>{house.titles}</td>
                <td>{house.swornMembers}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default Assignment;
