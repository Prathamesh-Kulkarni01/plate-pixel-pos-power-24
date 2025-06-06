
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRestaurant } from "@/contexts/RestaurantContext";
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Clock, 
  DollarSign,
  Receipt,
  UserPlus,
  X
} from "lucide-react";

interface TableGroupManagerProps {
  tableId: string;
  onClose: () => void;
}

const TableGroupManager = ({ tableId, onClose }: TableGroupManagerProps) => {
  const { 
    tables, 
    tableGroups, 
    createTableGroup, 
    updateTableGroup, 
    deleteTableGroup, 
    getActiveGroupsByTable, 
    getOrdersByGroup,
    customers,
    searchCustomers 
  } = useRestaurant();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    customerName: '',
    customerPhone: '',
    notes: '',
    customerId: '',
    waiterId: '',
    waiterName: ''
  });
  const [customerSearch, setCustomerSearch] = useState('');

  const table = tables.find(t => t.id === tableId);
  const activeGroups = getActiveGroupsByTable(tableId);

  if (!table) return null;

  const handleCreateGroup = () => {
    if (!formData.name || !formData.customerName) return;

    createTableGroup(tableId, {
      tableId,
      name: formData.name,
      status: 'active',
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      customerId: formData.customerId || undefined,
      notes: formData.notes || undefined,
      waiterId: formData.waiterId || undefined,
      waiterName: formData.waiterName || undefined
    });

    resetForm();
    setShowCreateForm(false);
  };

  const handleUpdateGroup = () => {
    if (!editingGroup || !formData.name || !formData.customerName) return;

    updateTableGroup(editingGroup, {
      name: formData.name,
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      customerId: formData.customerId || undefined,
      notes: formData.notes || undefined,
      waiterId: formData.waiterId || undefined,
      waiterName: formData.waiterName || undefined
    });

    resetForm();
    setEditingGroup(null);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      customerName: '',
      customerPhone: '',
      notes: '',
      customerId: '',
      waiterId: '',
      waiterName: ''
    });
    setCustomerSearch('');
  };

  const startEdit = (group: any) => {
    setFormData({
      name: group.name,
      customerName: group.customerName || '',
      customerPhone: group.customerPhone || '',
      notes: group.notes || '',
      customerId: group.customerId || '',
      waiterId: group.waiterId || '',
      waiterName: group.waiterName || ''
    });
    setEditingGroup(group.id);
    setShowCreateForm(true);
  };

  const getGroupStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-500';
      case 'ordering': return 'bg-yellow-500';
      case 'dining': return 'bg-green-500';
      case 'billing': return 'bg-orange-500';
      case 'paid': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const generateGroupName = () => {
    const existingNames = activeGroups.map(g => g.name);
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    
    for (const letter of letters) {
      const name = `Group ${letter}`;
      if (!existingNames.includes(name)) {
        return name;
      }
    }
    
    return `Group ${activeGroups.length + 1}`;
  };

  const filteredCustomers = customerSearch ? searchCustomers(customerSearch) : [];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Table {table.number} - Group Management</h2>
              <p className="text-muted-foreground">
                Manage groups for this table ({table.capacity} seats)
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Groups */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Active Groups ({activeGroups.length})</h3>
                <Button 
                  onClick={() => {
                    setFormData(prev => ({ ...prev, name: generateGroupName() }));
                    setShowCreateForm(true);
                  }}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Group
                </Button>
              </div>

              {activeGroups.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No active groups</p>
                    <p className="text-sm text-muted-foreground">Create a group to get started</p>
                  </CardContent>
                </Card>
              ) : (
                activeGroups.map((group) => {
                  const groupOrders = getOrdersByGroup(group.id);
                  const totalAmount = groupOrders.reduce((sum, order) => sum + order.total, 0);
                  const totalItems = groupOrders.reduce((sum, order) => sum + order.items.length, 0);

                  return (
                    <Card key={group.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{group.name}</CardTitle>
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${getGroupStatusColor(group.status)}`}></div>
                            <Badge variant="outline" className="capitalize">
                              {group.status}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          {/* Customer Info */}
                          <div>
                            <div className="font-medium">{group.customerName}</div>
                            {group.customerPhone && (
                              <div className="text-sm text-muted-foreground">{group.customerPhone}</div>
                            )}
                            {group.waiterName && (
                              <div className="text-sm text-muted-foreground">
                                Waiter: {group.waiterName}
                              </div>
                            )}
                          </div>

                          {/* Order Summary */}
                          {groupOrders.length > 0 && (
                            <div className="bg-muted/50 rounded p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Orders</span>
                                <Badge variant="outline">
                                  {groupOrders.length} order(s)
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span>{totalItems} items</span>
                                <span className="font-bold">${totalAmount.toFixed(2)}</span>
                              </div>
                            </div>
                          )}

                          {/* Time and Notes */}
                          <div className="text-xs text-muted-foreground space-y-1">
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              Created {Math.floor((Date.now() - group.createdAt.getTime()) / 60000)} min ago
                            </div>
                            {group.notes && (
                              <div className="italic">"{group.notes}"</div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startEdit(group)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                            >
                              <Receipt className="h-4 w-4 mr-1" />
                              Orders
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteTableGroup(group.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Status Actions */}
                          <div className="pt-2 border-t">
                            <Select 
                              value={group.status}
                              onValueChange={(value) => updateTableGroup(group.id, { status: value as any })}
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="ordering">Ordering</SelectItem>
                                <SelectItem value="dining">Dining</SelectItem>
                                <SelectItem value="billing">Billing</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>

            {/* Create/Edit Group Form */}
            {showCreateForm && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    {editingGroup ? 'Edit Group' : 'Create New Group'}
                  </h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingGroup(null);
                      resetForm();
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <Card>
                  <CardContent className="p-6 space-y-4">
                    {/* Group Name */}
                    <div>
                      <Label htmlFor="groupName">Group Name</Label>
                      <Input
                        id="groupName"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Group A"
                      />
                    </div>

                    {/* Customer Search */}
                    <div>
                      <Label htmlFor="customerSearch">Search Customer</Label>
                      <Input
                        id="customerSearch"
                        value={customerSearch}
                        onChange={(e) => setCustomerSearch(e.target.value)}
                        placeholder="Search by name, phone, or email"
                      />
                      {filteredCustomers.length > 0 && (
                        <div className="mt-2 space-y-1 max-h-32 overflow-y-auto border rounded">
                          {filteredCustomers.map((customer) => (
                            <button
                              key={customer.id}
                              type="button"
                              className="w-full text-left p-2 hover:bg-muted text-sm"
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  customerName: customer.name,
                                  customerPhone: customer.phone || '',
                                  customerId: customer.id
                                }));
                                setCustomerSearch('');
                              }}
                            >
                              <div className="font-medium">{customer.name}</div>
                              {customer.phone && (
                                <div className="text-muted-foreground">{customer.phone}</div>
                              )}
                              {customer.tags.length > 0 && (
                                <div className="flex gap-1 mt-1">
                                  {customer.tags.map(tag => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Customer Name */}
                    <div>
                      <Label htmlFor="customerName">Customer Name</Label>
                      <Input
                        id="customerName"
                        value={formData.customerName}
                        onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                        placeholder="Customer name"
                      />
                    </div>

                    {/* Customer Phone */}
                    <div>
                      <Label htmlFor="customerPhone">Customer Phone (Optional)</Label>
                      <Input
                        id="customerPhone"
                        value={formData.customerPhone}
                        onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                        placeholder="+1234567890"
                      />
                    </div>

                    {/* Waiter */}
                    <div>
                      <Label htmlFor="waiterName">Assigned Waiter (Optional)</Label>
                      <Input
                        id="waiterName"
                        value={formData.waiterName}
                        onChange={(e) => setFormData(prev => ({ ...prev, waiterName: e.target.value }))}
                        placeholder="Waiter name"
                      />
                    </div>

                    {/* Notes */}
                    <div>
                      <Label htmlFor="notes">Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Special requests, preferences, etc."
                        rows={3}
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Button 
                        onClick={editingGroup ? handleUpdateGroup : handleCreateGroup}
                        disabled={!formData.name || !formData.customerName}
                        className="flex-1"
                      >
                        {editingGroup ? 'Update Group' : 'Create Group'}
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setShowCreateForm(false);
                          setEditingGroup(null);
                          resetForm();
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableGroupManager;
