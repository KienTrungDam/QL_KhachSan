using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QLKhachSan.Migrations
{
    /// <inheritdoc />
    public partial class fixColumnTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CheckInDate",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "CheckOutDate",
                table: "Bookings");

            migrationBuilder.RenameColumn(
                name: "NumberOfGuests",
                table: "Bookings",
                newName: "BookingRoomId");

            migrationBuilder.CreateTable(
                name: "BookingRooms",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoomCount = table.Column<int>(type: "int", nullable: false),
                    ToTalPrice = table.Column<double>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BookingRooms", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BookingRoomDetails",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BookingRoomId = table.Column<int>(type: "int", nullable: false),
                    RoomId = table.Column<int>(type: "int", nullable: false),
                    CheckInDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CheckOutDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    NumberOfGuests = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BookingRoomDetails", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BookingRoomDetails_BookingRooms_BookingRoomId",
                        column: x => x.BookingRoomId,
                        principalTable: "BookingRooms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BookingRoomDetails_Rooms_RoomId",
                        column: x => x.RoomId,
                        principalTable: "Rooms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_BookingRoomId",
                table: "Bookings",
                column: "BookingRoomId");

            migrationBuilder.CreateIndex(
                name: "IX_BookingRoomDetails_BookingRoomId",
                table: "BookingRoomDetails",
                column: "BookingRoomId");

            migrationBuilder.CreateIndex(
                name: "IX_BookingRoomDetails_RoomId",
                table: "BookingRoomDetails",
                column: "RoomId");

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_BookingRooms_BookingRoomId",
                table: "Bookings",
                column: "BookingRoomId",
                principalTable: "BookingRooms",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_BookingRooms_BookingRoomId",
                table: "Bookings");

            migrationBuilder.DropTable(
                name: "BookingRoomDetails");

            migrationBuilder.DropTable(
                name: "BookingRooms");

            migrationBuilder.DropIndex(
                name: "IX_Bookings_BookingRoomId",
                table: "Bookings");

            migrationBuilder.RenameColumn(
                name: "BookingRoomId",
                table: "Bookings",
                newName: "NumberOfGuests");

            migrationBuilder.AddColumn<DateTime>(
                name: "CheckInDate",
                table: "Bookings",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CheckOutDate",
                table: "Bookings",
                type: "datetime2",
                nullable: true);
        }
    }
}
