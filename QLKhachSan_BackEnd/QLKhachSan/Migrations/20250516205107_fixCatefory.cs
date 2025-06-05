using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace QLKhachSan.Migrations
{
    /// <inheritdoc />
    public partial class fixCatefory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Rooms",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Rooms",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Rooms",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Rooms",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DropColumn(
                name: "Capacity",
                table: "CategoryRooms");

            migrationBuilder.UpdateData(
                table: "CategoryRooms",
                keyColumn: "Id",
                keyValue: 4,
                column: "Name",
                value: "Phòng SupperVip");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "Capacity",
                table: "CategoryRooms",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.UpdateData(
                table: "CategoryRooms",
                keyColumn: "Id",
                keyValue: 1,
                column: "Capacity",
                value: 50.0);

            migrationBuilder.UpdateData(
                table: "CategoryRooms",
                keyColumn: "Id",
                keyValue: 2,
                column: "Capacity",
                value: 70.0);

            migrationBuilder.UpdateData(
                table: "CategoryRooms",
                keyColumn: "Id",
                keyValue: 3,
                column: "Capacity",
                value: 80.0);

            migrationBuilder.UpdateData(
                table: "CategoryRooms",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "Capacity", "Name" },
                values: new object[] { 100.0, "Phòng SUpperVip" });

            migrationBuilder.InsertData(
                table: "Rooms",
                columns: new[] { "Id", "CategoryRoomId", "CreatedAt", "Description", "Floor", "MaxOccupancy", "PriceDay", "PriceWeek", "RoomNumber", "RoomSize", "Status", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, 1, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "View: biển, núi, có cửa sổ ngắm biển", 1, 0, 100.0, 500.0, 0, 0.0, "Trống", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 2, 2, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "View: biển, núi, có cửa sổ ngắm biển", 3, 0, 100.0, 500.0, 0, 0.0, "Đã thuê", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 3, 2, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "View: biển, núi, có cửa sổ ngắm biển", 2, 0, 100.0, 500.0, 0, 0.0, "Đã thuê", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 4, 3, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "View: biển, núi, có cửa sổ ngắm biển", 9, 0, 100.0, 500.0, 0, 0.0, "Trống", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) }
                });
        }
    }
}
