import React from "react";
import AdminDashboard from "../pages/admin/AdminDashboard";
import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import ManageGenres from "../pages/admin/genres/ManageGenres";
import ManageGames from "../pages/admin/games/ManageGames";
import GameCreate from "../pages/admin/games/gameCreate/GameCreate";
import GameEdit from "../pages/admin/games/gameEdit/GameEdit";
import ManageGameItems from "../pages/admin/gameItems/ManageGameItems";
import ManageGameAssociatedUsers from "../pages/admin/games/associatedUsers/ManageGameAssociatedUsers";
import ManageDevAndPub from "../pages/admin/developersAndPublishers/ManageDevAndPub";
import ManageDevAndPubAssociatedUsers from "../pages/admin/developersAndPublishers/associatedUsers/ManageDnPAssociatedUsers";
import ManageApproveGames from "../pages/admin/games/approveGames/ManageApproveGames";
import ManageApproveDevPub from "../pages/admin/developersAndPublishers/approveDevPub/ManageApproveDevPub";
import GamePreviewForApprove from "../pages/admin/games/approveGames/components/GamePreviewForApprove";

const adminRoutes = [
  <Route path="/admin" key="admin">
    <Route
      path="dashboard"
      element={
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="genres"
      element={
        <ProtectedRoute>
          <ManageGenres />
        </ProtectedRoute>
      }
    />
    <Route path="games">
      <Route
        index
        element={
          <ProtectedRoute>
            <ManageGames />
          </ProtectedRoute>
        }
      />
      <Route
        path="create"
        element={
          <ProtectedRoute>
            <GameCreate />
          </ProtectedRoute>
        }
      />
      <Route
        path="edit/:gameId"
        element={
          <ProtectedRoute>
            <GameEdit />
          </ProtectedRoute>
        }
      />
      <Route
        path="items/:gameId"
        element={
          <ProtectedRoute>
            <ManageGameItems />
          </ProtectedRoute>
        }
      />
      <Route
        path="associated-users/:gameId"
        element={
          <ProtectedRoute>
            <ManageGameAssociatedUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="approve"
        element={
          <ProtectedRoute>
            <ManageApproveGames />
          </ProtectedRoute>
        }
      />
      <Route
        path="approve/preview/:gameId"
        element={
          <ProtectedRoute>
            <GamePreviewForApprove />
          </ProtectedRoute>
        }
      />
    </Route>
    <Route path="developers-and-publishers">
      <Route
        index
        element={
          <ProtectedRoute>
            <ManageDevAndPub />
          </ProtectedRoute>
        }
      />
      <Route
        path="associated-users/:devpubId"
        element={
          <ProtectedRoute>
            <ManageDevAndPubAssociatedUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="approve"
        element={
          <ProtectedRoute>
            <ManageApproveDevPub />
          </ProtectedRoute>
        }
      />
    </Route>
  </Route>,
];

export default adminRoutes;
