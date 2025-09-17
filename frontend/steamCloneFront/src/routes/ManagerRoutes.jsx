import { Route } from "react-router-dom";
import ManageMyDevPubs from "../pages/manager/my-dev-pubs/ManageMyDevPubs";
import ManageMyGames from "../pages/manager/my-games/ManageMyGames";
import MyGameCreate from "../pages/manager/my-games/my-game-create/MyGameCreate";
import MyGameEdit from "../pages/manager/my-games/my-game-edit/MyGameEdit";
import ManageMyGameAssociatedUsers from "../pages/manager/my-games/associated-users/ManageMyGameAssociatedUsers";
import ManageMyGameItems from "../pages/manager/game-items/ManageMyGameItems";
import ProtectedRoute from "./ProtectedRoute";
import ManageDevAndPubAssociatedUsers from "../pages/manager/my-dev-pubs/associated-users/ManageDnPAssociatedUsers";

const managerRoutes = [
  <Route path="/manager" key="manager">
    <Route path="my-games">
      <Route index element={<ManageMyGames />} />
      <Route path="create" element={<MyGameCreate />} />
      <Route
        path="edit/:gameId"
        element={
          <ProtectedRoute>
            <MyGameEdit />
          </ProtectedRoute>
        }
      />
      <Route
        path="items/:gameId"
        element={
          <ProtectedRoute>
            <ManageMyGameItems />
          </ProtectedRoute>
        }
      />
      <Route
        path="associated-users/:gameId"
        element={
          <ProtectedRoute>
            <ManageMyGameAssociatedUsers />
          </ProtectedRoute>
        }
      />
    </Route>
    <Route path="my-developers-and-publishers">
      <Route index element={<ManageMyDevPubs />} />
      <Route
        path="associated-users/:devpubId"
        element={
          <ProtectedRoute>
            <ManageDevAndPubAssociatedUsers />
          </ProtectedRoute>
        }
      />
    </Route>
  </Route>,
];

export default managerRoutes;
