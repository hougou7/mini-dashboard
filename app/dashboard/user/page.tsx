const users = [
  {
    id: 1,
    name: "Alice",
    email: "alice@example.com",
  },
  {
    id: 2,
    name: "Bob",
    email: "bob@example.com",
  },
  {
    id: 3,
    name: "Tom",
    email: "tom@example.com",
  },
];

export default function UserPage(){
    return(
        <div>
            <h1>Users</h1>

            <div>
                {users.map((user) => (
                    <div key={user.id}>
                        <strong>{user.name}</strong>
                        <p>{user.email}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}