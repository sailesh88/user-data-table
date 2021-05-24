import { useEffect, useState } from 'react';
import { Spin, notification, Table } from 'antd';
import 'antd/dist/antd.css';
import InfiniteScroll from 'react-infinite-scroller';
import { Direction, FieldName, SortItem, UserInfo, usersApiService } from '../services/users-api.service';

function CustomTable() {

    const [dataset, setDataset] = useState<UserInfo[]>([]);
    const [pageIndex, setPageIndex] = useState(1);
    const [hasData, setHasData] = useState(true);
    const [sortItems, setSortItems] = useState<SortItem[]>([
        {
            direction: Direction.none,
            field: FieldName.id
        },
        {
            direction: Direction.none,
            field: FieldName.firstName,
        },
        {
            direction: Direction.none,
            field: FieldName.lastName
        },
        {
            direction: Direction.none,
            field: FieldName.profession
        },
    ]);


    // This is called once the app is loaded and then the user list is loaded and not sorted
    useEffect(() => {
        async function getData() {
            let resData: UserInfo[] = await usersApiService.getUsers(1).then((res) => {
                return res.data;
            }).catch((error) => {
                openNotification(error);
                return [];
            });
            resData.forEach((element) => {
                setDataset((prevState) => [...prevState, element]);
            });
        }
        getData();

    }, [setDataset]);

    // Function use to add more data to the user list with the same sorting list as user has selected
    async function addData() {
        setPageIndex(pageIndex + 1);
        await usersApiService.getUsers(pageIndex + 1, sortItems).then((res) => {
            if (res.data.length === 0)
                setHasData(false);
            else {
                res.data.forEach(element => {
                    let data = [...dataset];
                    const found = data.some(el => el.id === element.id);
                    if (!found) {
                        setDataset((prevState) => [...prevState, element]);
                    }
                });
            }
        }).catch((error) => {
            openNotification(error.getMessage);
        });

    };

    // Function use to sort data in asc or desc as the user selection
    async function onChange(pagination: any, filters: any, sorter: any, extra: any) {
        const key = sorter.columnKey;
        const sortOrder = sorter.order;

        let sortItem = [...sortItems];

        if (sortOrder === "ascend") {
            sortItem[key].direction = Direction.asc;
            setSortItems(sortItem);
        } else {
            sortItem[key].direction = Direction.desc;
            setSortItems(sortItem);
        }

        await usersApiService.getUsers(1, sortItems).then((res) => {
            setDataset([]);
            res.data.forEach(element => {
                setDataset((prevState) => [...prevState, element]);
            });
            setHasData(true);
            setPageIndex(1);
        }).catch((error) => {
            openNotification(error);
        });

    }

    // This is use to add header to table as per the ant design
    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 0,
            sorter: true,
            width: 100,
        },
        {
            title: 'First Name',
            dataIndex: 'firstName',
            key: 1,
            sorter: true,

        },
        {
            title: 'Last Name',
            dataIndex: 'lastName',
            key: 2,
            sorter: true,
        },
        {
            title: 'Profession',
            dataIndex: 'profession',
            key: 3,
            sorter: true,
        },
    ];

    // Ant Design notification once there is an error loading the data for now
    const openNotification = (Err: String) => {
        notification['error']({
            message: 'Network Error',
            description:
                Err,
            onClick: () => {
                console.log(Err);
            },
        });
    }

    return (
        <div
            style={{
                width: '100vh',
                height: 400,
                overflow: "auto",
            }}>

            <InfiniteScroll
                initialLoad={false}
                pageStart={0}
                loadMore={addData}
                hasMore={hasData}
                useWindow={false}
                loader={<Spin key={'Spinner' + pageIndex} />}>

                <Table
                    dataSource={dataset}
                    rowKey={(dataset) => dataset.id}
                    pagination={false}
                    bordered={true}
                    scroll={{ x: 700, scrollToFirstRowOnChange: false }}
                    sticky={true}
                    columns={columns}
                    onChange={onChange}
                />

            </InfiniteScroll>


        </div>
    );

}

export default CustomTable;
