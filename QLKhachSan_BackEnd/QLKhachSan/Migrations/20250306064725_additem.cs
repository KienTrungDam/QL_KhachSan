using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace QLKhachSan.Migrations
{
    /// <inheritdoc />
    public partial class additem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "CategoryRooms",
                columns: new[] { "Id", "Capacity", "Description", "Name" },
                values: new object[,]
                {
                    { 1, 50.0, "Phòng đơn", "Phòng đơn" },
                    { 2, 70.0, "Phòng đơn", "Phòng đôi" },
                    { 3, 80.0, "Phòng đơn", "Phòng Vip" },
                    { 4, 100.0, "Phòng đơn", "Phòng SUpperVip" }
                });

            migrationBuilder.InsertData(
                table: "Resorts",
                columns: new[] { "Id", "Address", "Name", "PhoneNumber", "Rate" },
                values: new object[,]
                {
                    { 1, "123", "Resort 1", "123", 5 },
                    { 2, "123", "Resort 2", "123", 4 },
                    { 3, "123", "Resort 3", "123", 2 },
                    { 4, "123", "Resort 4", "123", 1 }
                });

            migrationBuilder.InsertData(
                table: "Rooms",
                columns: new[] { "Id", "CategoryRoomId", "PriceDay", "PriceHour", "PriceMonth", "PriceWeek", "ResortId", "Status" },
                values: new object[,]
                {
                    { 1, 1, 100.0, 10.0, 2000.0, 500.0, 1, "Trống" },
                    { 2, 2, 100.0, 10.0, 2000.0, 500.0, 2, "Đã thuê" },
                    { 3, 2, 100.0, 10.0, 2000.0, 500.0, 2, "Đã thuê" },
                    { 4, 3, 100.0, 10.0, 2000.0, 500.0, 1, "Trống" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "CategoryRooms",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Resorts",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Resorts",
                keyColumn: "Id",
                keyValue: 4);

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

            migrationBuilder.DeleteData(
                table: "CategoryRooms",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "CategoryRooms",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "CategoryRooms",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Resorts",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Resorts",
                keyColumn: "Id",
                keyValue: 2);
        }
    }
}
