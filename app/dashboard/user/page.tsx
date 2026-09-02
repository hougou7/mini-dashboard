type User = {
    id: number;
    name: string;
    email: string;
};

async function getUsers(): Promise<User[]> {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    if(!res.ok){
        throw new Error("Failed to fetch users");
    }  
    return (await res.json()) as User[];
}

export default async function UserPage(){
    const users = await getUsers();
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
