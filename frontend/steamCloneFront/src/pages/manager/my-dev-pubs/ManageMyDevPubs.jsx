import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  useCreateDeveloperAndPublisherMutation,
  useByAssociatedUserQuery,
} from "../../../services/developerAndPublisher/developerAndPublisherApi";
import "./ManageMyDevPubs.scss";
import DevPubRow from "./components/DevPubRow";
import { DevPubModal } from "./components/modal/DevPubModal";
import { useNavigate } from "react-router-dom";
import { useGetProfileQuery } from "../../../services/user/userApi";
import { useSearchFilter } from "../../../components/Search/useSearchFilter";

const ManageMyDevPubs = () => {
  const navigate = useNavigate();

  const { data: { payload: user } = {}, isLoading: isUserLoading } =
    useGetProfileQuery();

  const {
    data: { payload: approvedDevsAndPubs } = { payload: [] },
    isLoading: isApprovedLoading,
    refetch: refetchApproved,
    error,
  } = useByAssociatedUserQuery(true);
  const {
    data: { payload: pendingDevsAndPubs } = { payload: [] },
    isLoading: isPendingLoading,
    refetch: refetchPending,
  } = useByAssociatedUserQuery(null);
  const {
    data: { payload: rejectedDevsAndPubs } = { payload: [] },
    isLoading: isRejectedLoading,
    refetch: refetchRejected,
  } = useByAssociatedUserQuery(false);

  const [activeTab, setActiveTab] = useState("approved");

  // Select the correct list for the active tab
  let itemsToShow = [];
  if (activeTab === "approved") itemsToShow = approvedDevsAndPubs;
  else if (activeTab === "pending") itemsToShow = pendingDevsAndPubs;
  else if (activeTab === "rejected") itemsToShow = rejectedDevsAndPubs;

  // Use a single search input and hook for the current tab
  const {
    query: searchQuery,
    filteredList: filteredItemsToShow,
    handleSearch,
  } = useSearchFilter(itemsToShow, (item, query) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [createDevPub, { isLoading: isCreating }] =
    useCreateDeveloperAndPublisherMutation();
  const [modalReset, setModalReset] = useState(() => () => {});

  useEffect(() => {
    refetchApproved();
    refetchPending();
    refetchRejected();
  }, []);

  const tabConfig = [
    { key: "approved", label: "Approved", count: approvedDevsAndPubs.length },
    { key: "pending", label: "Pending", count: pendingDevsAndPubs.length },
    { key: "rejected", label: "Rejected", count: rejectedDevsAndPubs.length },
  ];

  const handleClose = () => {
    setCreateModalOpen(false);
    modalReset();
  };

  const handleCreateDevPub = async (data) => {
    try {
      await createDevPub(data).unwrap();
      setCreateModalOpen(false);
      toast.success("Created successfully");
      modalReset();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create");
    }
  };

  if (isApprovedLoading || isPendingLoading || isRejectedLoading)
    return <div className="loading-overlay visible">Loading data...</div>;
  if (error) return <div>Error loading developers and publishers</div>;

  return (
    <div className="manage-container flux-border">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <h2 style={{ margin: 0 }}>Manage Developers & Publishers</h2>
        <div>
          <button
            className="create-manage-btn"
            onClick={() => setCreateModalOpen(true)}
            disabled={isCreating}
          >
            {isCreating ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
      <div className="manage-search-bar">
        <input
          type="text"
          placeholder={`Search ${activeTab} developers & publishers...`}
          onChange={handleSearch}
          value={searchQuery}
        />
      </div>
      <div
        className="tabs"
        style={{ display: "flex", gap: "10px", justifyContent: "center" }}
      >
        {tabConfig.map((tab) => (
          <button
            key={tab.key}
            className={`tab-btn${activeTab === tab.key ? " active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>
      <table className="manage-table">
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "8px" }}>Status</th>
            <th style={{ textAlign: "left", padding: "8px" }}>Name</th>
            <th style={{ textAlign: "center", padding: "8px", width: "340px" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredItemsToShow.length > 0 ? (
            filteredItemsToShow.map((item) => (
              <DevPubRow key={item.id} devpub={item} user={user} />
            ))
          ) : (
            <tr>
              <td colSpan={3} style={{ textAlign: "center", padding: "8px" }}>
                No developers or publishers available
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <DevPubModal
        isOpen={isCreateModalOpen}
        onClose={handleClose}
        onSubmit={handleCreateDevPub}
        titleText="Create Developer/Publisher"
        confirmText="Create"
        setModalReset={setModalReset}
      />
    </div>
  );
};

export default ManageMyDevPubs;
