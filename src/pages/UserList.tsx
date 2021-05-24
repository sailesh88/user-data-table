import CustomTable from '../component/CustomTable';


function UserList() {

    return (
        <div>
            <div className="Content-Container">
                <span className="Content-Title">User Lists</span>
            </div>
            <div className="Content-Container">
                <CustomTable />
            </div>
        </div>
    );

}

export default UserList;
